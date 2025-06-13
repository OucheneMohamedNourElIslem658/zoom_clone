package room

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/OucheneMohamedNourElIslem658/zoom_clone/config"
	"github.com/OucheneMohamedNourElIslem658/zoom_clone/models"
	"github.com/OucheneMohamedNourElIslem658/zoom_clone/pkg/database"
	"github.com/livekit/protocol/auth"
	"github.com/livekit/protocol/livekit"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"gorm.io/gorm"
	lksdk "github.com/livekit/server-sdk-go/v2"
)

type RoomRepository struct {
	database *gorm.DB
}

func NewRoomRepository() *RoomRepository {
	return &RoomRepository{
		database: database.Instance,
	}
}

func (r *RoomRepository) JoinRoom(userID string, meetingID uint) (token *string, apiErr *status.Status) {
	var participant models.MeetParticipant
	err := r.database.
		Where("user_id = ? AND meeting_id = ?", userID, meetingID).
		Preload("User").
		First(&participant).
		Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, status.New(codes.NotFound, "user is not a participant of this meeting")
		}

		return nil, status.New(codes.Internal, "failed to check user participation: "+err.Error())
	}

	config := config.Load()
	if config == nil {
		return nil, status.New(codes.Internal, "live configuration is not set")
	}

	at := auth.NewAccessToken(
		config.LiveKitAPIKey,
		config.LiveKitAPISecret,
	)

	grant := &auth.VideoGrant{
		RoomAdmin: participant.IsHost,
		RoomJoin:  !participant.IsBanned,
		Room:      string(meetingID),
	}

	userMetaData := map[string]any{
		"user_id": participant.User.ID,
		"email":   participant.User.Email,
		"name":    participant.User.RawUserMetaData.Name,
		"avatar":  participant.User.RawUserMetaData.AvatarURL,
	}

	userMeataDataJson, err := json.Marshal(userMetaData)
	if err != nil {
		return nil, status.New(codes.Internal, "failed to marshal user metadata: "+err.Error())
	}

	roomToken := at.
		SetVideoGrant(grant).
		SetIdentity(userID).
		SetName(participant.User.RawUserMetaData.Name).
		SetMetadata(string(userMeataDataJson))

	if err != nil {
		return nil, status.New(codes.Internal, "failed to create room token: "+err.Error())
	}

	tokenString, err := roomToken.ToJWT()
	if err != nil {
		return nil, status.New(codes.Internal, "failed to generate JWT token: "+err.Error())
	}

	return &tokenString, nil
}

type EgressHttpClient struct {
	LiveKitURL string
	livekit.HTTPClient
}

func (c *EgressHttpClient) Do(req *http.Request) (*http.Response, error) {
	return c.HTTPClient.Do(req)
}

func (r *RoomRepository) RecordRoom(userID string, meetingID uint) (error) {
	// Verify if user is participant
	var isParticipant bool
	err := r.database.Model(&models.MeetParticipant{}).
		Where("meeting_id = ? AND user_id = ?", meetingID, userID).
		Select("COUNT(*) > 0").
		Scan(&isParticipant).
		Error
	if err != nil {
		return status.Error(codes.Internal, "failed to check user participation: "+err.Error())
	}

	if !isParticipant {
		return status.Error(codes.PermissionDenied, "user is not a participant of this meeting")
	}

	config := config.Load()

	// Start Recording:
	req := &livekit.RoomCompositeEgressRequest{
		RoomName:      string(meetingID),
		Layout:        "speaker",
		AudioOnly:     false,
		CustomBaseUrl: "https://my-custom-template.com",
		Options: &livekit.RoomCompositeEgressRequest_Preset{
			Preset: livekit.EncodingOptionsPreset_PORTRAIT_H264_1080P_30,
		},
	}
	req.SegmentOutputs = []*livekit.SegmentedFileOutput{
		{
			FilenamePrefix:   "my-output",
			PlaylistName:     "my-output.m3u8",
			LivePlaylistName: "my-output-live.m3u8",
			SegmentDuration:  2,
			Output: &livekit.SegmentedFileOutput_S3{
				S3: &livekit.S3Upload{
					AccessKey:      config.StorageAccessKey,
					Secret:         config.StorageSecretKey,
					Endpoint:       config.StorageEndpoint,
					Bucket:         config.StorageBucketName,
					ForcePathStyle: true,
				},
			},
		},
	}

	egressClient := lksdk.NewEgressClient(
		config.LiveKitURL,
		config.LiveKitAPIKey,
		config.LiveKitAPISecret,
	)

	log.Println("Starting room recording for meeting ID:", meetingID)

	resp, err := egressClient.StartRoomCompositeEgress(context.Background(), req)
	log.Println("Egress response:", err)
	if err != nil {
		return status.Error(codes.Internal, "failed to start room recording: "+err.Error())
	}

	err = r.database.Model(&models.MeetParticipant{}).
	    Where("meeting_id = ? AND user_id = ?", meetingID, userID).
		Update("record_url", resp.EgressId).
		Error

	if err != nil {
		// Stop Egress: 
		stopReq := &livekit.StopEgressRequest{
			EgressId:  resp.EgressId,
		}

		_, err := egressClient.StopEgress(context.Background(), stopReq)
		if err != nil {
			return status.Error(codes.Internal, "failed to stop egress: "+err.Error())
		}

		return status.Error(codes.Internal, "failed to update participant record URL: "+err.Error())
	}

	return nil
}

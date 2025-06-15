package room

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/OucheneMohamedNourElIslem658/zoom_clone/config"
	"github.com/OucheneMohamedNourElIslem658/zoom_clone/models"
	"github.com/OucheneMohamedNourElIslem658/zoom_clone/pkg/database"
	"github.com/livekit/protocol/auth"
	"github.com/livekit/protocol/livekit"
	lksdk "github.com/livekit/server-sdk-go/v2"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"gorm.io/gorm"
)

type RoomRepository struct {
	database *gorm.DB
}

func NewRoomRepository() *RoomRepository {
	return &RoomRepository{
		database: database.Instance,
	}
}

func (r *RoomRepository) JoinRoom(userID string, meetingID string) (token *string, apiErr *status.Status) {
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
		RoomAdmin:  participant.IsHost,
		RoomJoin:   !participant.IsBanned,
		Room:       meetingID,
		RoomRecord: true,
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

func (r *RoomRepository) RecordRoom(userID string, meetingID string) error {
	var participant models.MeetParticipant
	err := r.database.Model(&models.MeetParticipant{}).
		Where("meeting_id = ? AND user_id = ?", meetingID, userID).
		Preload("Meeting").
		First(&participant).
		Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return status.Error(codes.NotFound, "user is not a participant of this meeting")
		}
		return status.Error(codes.Internal, "failed to check user participation: "+err.Error())
	}

	config := config.Load()

	client := lksdk.NewRoomServiceClient(
		config.LiveKitURL,
	    config.LiveKitAPIKey,
		config.LiveKitAPISecret,
	)

	existingRooms, err := client.ListRooms(context.Background(), &livekit.ListRoomsRequest{
		Names:  []string{meetingID},
	})

	if err != nil {
		return status.Error(codes.Internal, "failed to list rooms: "+err.Error())
	}
	
	if len(existingRooms.Rooms) == 0 {
		return status.Error(codes.NotFound, "room does not exist")
	}			

	req := &livekit.RoomCompositeEgressRequest{
		RoomName:  string(meetingID),
		Layout:    "speaker",
		AudioOnly: false,
		Options: &livekit.RoomCompositeEgressRequest_Preset{
			Preset: livekit.EncodingOptionsPreset_PORTRAIT_H264_1080P_30,
		},
	}

	// Use a unique folder for each recording by including a timestamp
	folderPath := fmt.Sprintf("rooms/%s/%s/%d/", meetingID, userID, time.Now().UnixNano())
	meetTitle := participant.Meeting.Title

	// req.SegmentOutputs = []*livekit.SegmentedFileOutput{
	// 	{
	// 		FilenamePrefix:   folderPath + meetTitle,
	// 		PlaylistName:     folderPath + fmt.Sprintf("%v.mp4", meetTitle),
	// 		LivePlaylistName: folderPath + fmt.Sprintf("%v-live.mp4", meetTitle),
	// 		SegmentDuration:  2,
	// 		Output: &livekit.SegmentedFileOutput_S3{
	// 			S3: &livekit.S3Upload{
	// 				AccessKey:      config.StorageAccessKey,
	// 				Secret:         config.StorageSecretKey,
	// 				Endpoint:       config.StorageEndpoint,
	// 				Bucket:         config.StorageBucketName,
	// 				ForcePathStyle: true,
	// 			},
	// 		},
	// 	},
	// }

	req.FileOutputs = []*livekit.EncodedFileOutput{
		{
			Filepath:  folderPath + meetTitle + ".mp4",
			Output: &livekit.EncodedFileOutput_S3{
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

	resp, err := egressClient.StartRoomCompositeEgress(context.Background(), req)
	if err != nil {
		return status.Error(codes.Internal, "failed to start room recording: "+err.Error())
	}

	participant.EgressIDs = append(participant.EgressIDs, resp.EgressId)

	err = r.database.Model(&models.MeetParticipant{}).
		Where("meeting_id = ? AND user_id = ?", meetingID, userID).
		Save(&participant).
		Error
	if err != nil {
		return status.Error(codes.Internal, "failed to update participant egress IDs: "+err.Error())
	}

	if err != nil {
		// Stop Egress:
		stopReq := &livekit.StopEgressRequest{
			EgressId: resp.EgressId,
		}

		_, err := egressClient.StopEgress(context.Background(), stopReq)
		if err != nil {
			return status.Error(codes.Internal, "failed to stop egress: "+err.Error())
		}

		return status.Error(codes.Internal, "failed to update participant record URL: "+err.Error())
	}

	return nil
}

func (r *RoomRepository) StopRecording(userID string, meetingID string) (error) {
	var participant models.MeetParticipant
	err := r.database.Model(&models.MeetParticipant{}).
		Where("meeting_id = ? AND user_id = ?", meetingID, userID).
		First(&participant).
		Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return status.Error(codes.NotFound, "user is not a participant of this meeting")
		}
		return status.Error(codes.Internal, "failed to check user participation: "+err.Error())
	}

	if len(participant.EgressIDs) == 0 {
		return status.Error(codes.NotFound, "no recording found for this participant")
	}

	// stop the last egress
	egressID := participant.EgressIDs[len(participant.EgressIDs)-1]
	log.Println(egressID)
	req := &livekit.StopEgressRequest{
		EgressId: egressID,
	}

	config := config.Load()

	egressClient := lksdk.NewEgressClient(
		config.LiveKitURL,
		config.LiveKitAPIKey,
		config.LiveKitAPISecret,
	)

	 _, err = egressClient.StopEgress(context.Background(), req)
	if err != nil {
		return status.Error(codes.Internal, "failed to stop egress: "+err.Error())
	}

	return nil
}

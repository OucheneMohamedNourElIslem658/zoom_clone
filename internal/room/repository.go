package room

import (
	"encoding/json"

	"github.com/OucheneMohamedNourElIslem658/zoom_clone/config"
	"github.com/OucheneMohamedNourElIslem658/zoom_clone/models"
	"github.com/OucheneMohamedNourElIslem658/zoom_clone/pkg/database"
	"github.com/livekit/protocol/auth"
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
		RoomJoin: !participant.IsBanned,
		Room: string(meetingID),
	}

	userMetaData := map[string]any{
		"user_id": participant.User.ID,
		"email": participant.User.Email,
		"name": participant.User.RawUserMetaData.Name,
		"avatar": participant.User.RawUserMetaData.AvatarURL,
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
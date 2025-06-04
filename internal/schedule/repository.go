package schedule

import (
	schedulepb "github.com/OucheneMohamedNourElIslem658/zoom_clone/api/pb"
	"github.com/OucheneMohamedNourElIslem658/zoom_clone/models"
	"github.com/OucheneMohamedNourElIslem658/zoom_clone/pkg/database"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"gorm.io/gorm"
)

type ScheduleRepo struct {
	database *gorm.DB
}

func NewScheduleRepo() *ScheduleRepo {
	return &ScheduleRepo{
		database: database.Instance,
	}
}

func (sr *ScheduleRepo) CreateMeeting(hostID string, meeting *schedulepb.CreateMeetingRequest) (apiErr *error) {

	err := sr.database.Create(&models.Meeting{
		Title:       meeting.Title,
		Description: meeting.Description,
		StartTime:   meeting.StartTime.AsTime(),
		Type:        models.MeetingType(meeting.Type.String()),
	})

	if err != nil {
		apiError := status.Error(codes.Internal,  "Failed to create meeting")
		return &apiError
	}

	participants := make([]models.MeetParticipant, 0, len(meeting.ParticipantIds))
	for _, participantId := range meeting.ParticipantIds {
		participants = append(participants, models.MeetParticipant{
			UserID: participantId,
			IsHost: participantId == hostID,
		})
	}

	if err := sr.database.Create(&participants).Error; err != nil {
		apiError := status.Error(codes.Internal, "Failed to create participants")
		return &apiError
	}
	
	return nil
}

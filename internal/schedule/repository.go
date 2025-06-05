package schedule

import (
	"strings"
	"time"

	schedulepb "github.com/OucheneMohamedNourElIslem658/zoom_clone/api/pb"
	"github.com/OucheneMohamedNourElIslem658/zoom_clone/models"
	"github.com/OucheneMohamedNourElIslem658/zoom_clone/pkg/database"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
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

func (sr *ScheduleRepo) CreateMeeting(hostID string, meeting *schedulepb.CreateMeetingRequest) (err error) {
	createdMeeting := &models.Meeting{
		Title:       meeting.Title,
		Description: meeting.Description,
		StartTime:   meeting.StartTime.AsTime(),
		Type:        models.MeetingType(meeting.Type.String()),
	}
	err = sr.database.Create(createdMeeting).Error

	if err != nil {
		err = status.Error(codes.Internal, "Failed to create meeting")
		return err
	}

	participants := make([]models.MeetParticipant, 0, len(meeting.ParticipantIds))
	for _, participantId := range meeting.ParticipantIds {
		participants = append(participants, models.MeetParticipant{
			UserID:    participantId,
			MeetingID: createdMeeting.ID,
			IsHost:    false,
		})
	}

	// add the host as a participant
	participants = append(participants, models.MeetParticipant{
		UserID:    hostID,
		MeetingID: createdMeeting.ID,
		IsHost:    true,
	})

	// remove host from participant list if they are already included
	for i, participant := range participants {
		if participant.UserID == hostID {
			participants = append(participants[:i], participants[i+1:]...)
			break
		}
	}

	if err := sr.database.Create(&participants).Error; err != nil {
		err = status.Error(codes.Internal, "Failed to create participants")
		return err
	}

	return nil
}

func (sr *ScheduleRepo) UpdateMeeting(hostID string, meeting *schedulepb.UpdateMeetingRequest) (err error) {
	existingMeeting := &models.Meeting{}
	if err = sr.database.First(existingMeeting, meeting.Id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return status.Error(codes.NotFound, "Meeting not found")
		}
		return status.Error(codes.Internal, "Failed to retrieve meeting")
	}

	var isCurrentUserHost bool
	if err = sr.database.Model(&models.MeetParticipant{}).
		Where("meeting_id = ? AND user_id = ?", existingMeeting.ID, hostID).
		Select("is_host").
		Scan(&isCurrentUserHost).Error; err != nil {
		return status.Error(codes.Internal, "Failed to check host status")
	}

	if !isCurrentUserHost {
		return status.Error(codes.PermissionDenied, "You are not the host of this meeting")
	}

	if !existingMeeting.IsCancelled || existingMeeting.StartTime.After(time.Now()) {
		if meeting.Title != nil && existingMeeting.Title != *meeting.Title {
			existingMeeting.Title = *meeting.Title
		}

		if meeting.Description != nil && existingMeeting.Description != *meeting.Description {
			existingMeeting.Description = *meeting.Description
		}

		if meeting.StartTime != nil && existingMeeting.StartTime != meeting.StartTime.AsTime() {
			existingMeeting.StartTime = meeting.StartTime.AsTime()
		}

		if existingMeeting.Type != models.MeetingType(meeting.Type.String()) {
			existingMeeting.Type = models.MeetingType(meeting.Type.String())
		}

		if meeting.IsCancelled != nil && !*meeting.IsCancelled {
			existingMeeting.IsCancelled = true
		}
	} else if existingMeeting.IsCancelled {
		return status.Error(codes.FailedPrecondition, "Cannot update a cancelled meeting")
	} else {
		return status.Error(codes.FailedPrecondition, "Cannot update a meeting that has already started")
	}

	if meeting.ParticipantIds != nil {
		newParticipants := make([]models.MeetParticipant, 0, len(meeting.ParticipantIds))
		for _, participantId := range meeting.ParticipantIds {
			if participantId != hostID {
				newParticipants = append(newParticipants, models.MeetParticipant{
					UserID:    participantId,
					MeetingID: existingMeeting.ID,
					IsHost:    false,
				})
			}
		}

		if err := sr.database.
			Where("meeting_id = ? AND is_host = ?", existingMeeting.ID, false).
			Delete(&models.MeetParticipant{}).Error; err != nil {
			return status.Error(codes.Internal, "Failed to remove old participants")
		}

		if len(newParticipants) > 0 {
			if err := sr.database.Create(&newParticipants).Error; err != nil {
				return status.Error(codes.Internal, "Failed to add new participants")
			}
		}
	}

	if err := sr.database.Save(existingMeeting).Error; err != nil {
		return status.Error(codes.Internal, "Failed to update meeting")
	}

	return nil
}

func (sr *ScheduleRepo) GetAllMeetings(userID string, req *schedulepb.SearchMeetingsRequest) (*schedulepb.SearchMeetingsResponse, error) {
	var meetings []models.Meeting

	db := sr.database.Model(&models.Meeting{}).
		Joins("JOIN meet_participants ON meet_participants.meeting_id = meetings.id").
		Where("meet_participants.user_id = ?", userID)

	if req.Query != "" {
		query := "%" + strings.ToLower(req.Query) + "%"
		db = db.Where("LOWER(meetings.title) LIKE ? OR LOWER(meetings.description) LIKE ?", query, query)
	}

	switch req.Category {
	case schedulepb.SearchMeetingsRequest_UPCOMING:
		db = db.Where("meetings.start_time > NOW()")
	case schedulepb.SearchMeetingsRequest_PASSED:
		db = db.Where("meetings.start_time <= NOW()")
	case schedulepb.SearchMeetingsRequest_ALL:
		// no filtering needed
	default:
		// invalid input fallback (no-op)
	}

	// Optional pagination
	if req.LastId != nil {
		db = db.Where("meetings.id > ?", *req.LastId)
	}
	if req.PageSize > 0 {
		db = db.Limit(int(req.PageSize))
	}

	// Preload up to 4 participants per meeting, prioritizing the host
	db = db.Preload("Participants", func(tx *gorm.DB) *gorm.DB {
		return tx.
			Joins("JOIN meet_participants ON meet_participants.user_id = users.id").
			Order("meet_participants.is_host DESC").
			Limit(4)
	})

	// Final query
	if err := db.Order("meetings.id ASC").Find(&meetings).Error; err != nil {
		return nil, status.Error(codes.Internal, "FAILED_TO_FETCH_MEETINGS")
	}

	// Transform into protobuf response
	meetingResponses := make([]*schedulepb.Meeting, 0, len(meetings))
	for _, m := range meetings {
		var host *schedulepb.MeetParticipant
		var others []*schedulepb.MeetParticipant

		for i, p := range m.Participants {
			participant := &schedulepb.MeetParticipant{
				Id:        p.ID,
				Email:     p.Email,
				Name:      p.RawUserMetaData.Name,
				AvatarUrl: p.RawUserMetaData.AvatarURL,
			}

			if i == 0 {
				host = participant
			} else {
				others = append(others, participant)
			}
		}

		meetingResponses = append(meetingResponses, &schedulepb.Meeting{
			Id:                     uint32(m.ID),
			Title:                  m.Title,
			Description:            m.Description,
			StartTime:              timestamppb.New(m.StartTime),
			IsCancelled:            m.IsCancelled,
			Type:                   schedulepb.MeetingType(schedulepb.MeetingType_value[string(m.Type)]),
			Host:                   host,
			FirstThreeParticipants: others,
		})
	}

	return &schedulepb.SearchMeetingsResponse{
		Meetings: meetingResponses,
	}, nil
}


// func (sr *ScheduleRepo) GetUsers(userID string) ([]models.User, error) {
// }

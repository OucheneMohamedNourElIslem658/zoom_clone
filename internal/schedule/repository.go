package schedule

import (
	"strings"

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

	if meeting.ParticipantIds != nil {
		participants := []models.MeetParticipant{}

		for _, participantId := range meeting.ParticipantIds {
			if participantId == hostID {
				continue
			}
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

		if err := sr.database.Create(&participants).Error; err != nil {
			err = status.Error(codes.Internal, "Failed to create participants")
			return err
		}
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
		return status.Error(codes.Internal, "Requester is not the host of this meeting")
	}

	if !isCurrentUserHost {
		return status.Error(codes.PermissionDenied, "You are not the host of this meeting")
	}

	if !existingMeeting.IsCancelled {
		if meeting.Title != nil && existingMeeting.Title != *meeting.Title {
			existingMeeting.Title = *meeting.Title
		}

		if meeting.Description != nil && existingMeeting.Description != *meeting.Description {
			existingMeeting.Description = *meeting.Description
		}

		if meeting.StartTime != nil && existingMeeting.StartTime != meeting.StartTime.AsTime() {
			existingMeeting.StartTime = meeting.StartTime.AsTime()
		}

		if meeting.Type != nil && existingMeeting.Type != models.MeetingType(meeting.Type.String()) {
			existingMeeting.Type = models.MeetingType(meeting.Type.String())
		}

		if meeting.ParticipantIds != nil || meeting.IsParticipantIdsEmpty {
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

	} else if existingMeeting.IsCancelled {
		return status.Error(codes.FailedPrecondition, "Cannot update a cancelled meeting")
	}

	if meeting.IsCancelled != nil && *meeting.IsCancelled && !existingMeeting.IsCancelled {
		existingMeeting.IsCancelled = true
	}

	if err := sr.database.Save(existingMeeting).Error; err != nil {
		return status.Error(codes.Internal, "Failed to update meeting")
	}

	return nil
}

func (sr *ScheduleRepo) GetMeeting(userID string, req *schedulepb.GetMeetingRequest) (*schedulepb.Meeting, error) {
	var meeting models.Meeting

	if err := sr.database.Model(&models.Meeting{}).
		Select("meetings.id, meetings.title, meetings.description, meetings.start_time, meetings.is_cancelled, meetings.type, meetings.created_at, meetings.deleted_at").
		Joins("JOIN meet_participants ON meet_participants.meeting_id = meetings.id").
		Where("meetings.id = ? AND meet_participants.user_id = ?", req.Id, userID).
		Preload("Participants", func(tx *gorm.DB) *gorm.DB {
			return tx.Joins("JOIN meet_participants ON meet_participants.user_id = users.id").
				Order("meet_participants.is_host DESC")
		}).
		First(&meeting).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, status.Error(codes.NotFound, "Meeting not found")
		}
		return nil, status.Error(codes.Internal, "Failed to fetch meeting")
	}

	var host *schedulepb.MeetParticipant
	var others []*schedulepb.MeetParticipant

	for i, p := range meeting.Participants {
		if i == 0 {
			continue
		}
		participant := &schedulepb.MeetParticipant{
			Id:        p.ID,
			Email:     p.Email,
			Name:      p.RawUserMetaData.Name,
			AvatarUrl: p.RawUserMetaData.AvatarURL,
		}

		if i == 1 {
			host = participant
		} else {
			others = append(others, participant)
		}
	}

	return &schedulepb.Meeting{
		Id:                     uint32(meeting.ID),
		Title:                  meeting.Title,
		Description:            meeting.Description,
		StartTime:              timestamppb.New(meeting.StartTime),
		IsCancelled:            meeting.IsCancelled,
		Type:                   schedulepb.MeetingType(schedulepb.MeetingType_value[string(meeting.Type)]),
		Host:                   host,
		FirstThreeParticipants: others,
		ParticipantsCount:      uint32(meeting.ParticipantsCount),
	}, nil
}

func (sr *ScheduleRepo) GetAllMeetings(userID string, req *schedulepb.SearchMeetingsRequest) (*schedulepb.SearchMeetingsResponse, error) {
	var meetings []models.Meeting

	// Step 1: Base query to fetch meetings the user is part of
	db := sr.database.Model(&models.Meeting{}).
		Joins("JOIN meet_participants ON meet_participants.meeting_id = meetings.id").
		Where("meet_participants.user_id = ?", userID).
		Select("DISTINCT meetings.*")

	// Apply filters
	if req.Query != "" {
		query := "%" + strings.ToLower(req.Query) + "%"
		db = db.Where("LOWER(meetings.title) LIKE ? OR LOWER(meetings.description) LIKE ?", query, query)
	}

	switch req.Category {
	case schedulepb.SearchMeetingsRequest_UPCOMING:
		db = db.Where("meetings.start_time > NOW()")
	case schedulepb.SearchMeetingsRequest_PASSED:
		db = db.Where("meetings.start_time <= NOW()")
	}

	if req.LastId != nil {
		db = db.Where("meetings.id > ?", *req.LastId)
	}
	if req.PageSize > 0 {
		db = db.Limit(int(req.PageSize))
	}

	if err := db.Order("meetings.id ASC").Find(&meetings).Error; err != nil {
		return nil, status.Error(codes.Internal, "FAILED_TO_FETCH_MEETINGS")
	}

	// Step 2: Build response, manually load participants
	meetingResponses := make([]*schedulepb.Meeting, 0, len(meetings))
	for _, m := range meetings {
		var participants []models.User

		// Fetch up to 5 participants ordered by host first
		err := sr.database.
			Model(&models.User{}).
			Joins("JOIN meet_participants ON meet_participants.user_id = users.id").
			Where("meet_participants.meeting_id = ?", m.ID).
			Order("meet_participants.is_host DESC").
			Limit(5).
			Find(&participants).Error
		if err != nil {
			continue
		}

		var host *schedulepb.MeetParticipant
		var otherParticipants []*schedulepb.MeetParticipant

		if len(participants) > 0 {
			host = &schedulepb.MeetParticipant{
				Id:        participants[0].ID,
				Email:     participants[0].Email,
				Name:      participants[0].RawUserMetaData.Name,
				AvatarUrl: participants[0].RawUserMetaData.AvatarURL,
			}
		}

		for i := 1; i < len(participants) && len(otherParticipants) < 3; i++ {
			p := participants[i]
			if host != nil && p.ID == host.Id {
				continue
			}
			otherParticipants = append(otherParticipants, &schedulepb.MeetParticipant{
				Id:        p.ID,
				Email:     p.Email,
				Name:      p.RawUserMetaData.Name,
				AvatarUrl: p.RawUserMetaData.AvatarURL,
			})
		}

		// Fetch participants count separately
		var count int64
		sr.database.Model(&models.MeetParticipant{}).Where("meeting_id = ?", m.ID).Count(&count)

		meetingResponses = append(meetingResponses, &schedulepb.Meeting{
			Id:                     uint32(m.ID),
			Title:                  m.Title,
			Description:            m.Description,
			StartTime:              timestamppb.New(m.StartTime),
			IsCancelled:            m.IsCancelled,
			Type:                   schedulepb.MeetingType(schedulepb.MeetingType_value[string(m.Type)]),
			Host:                   host,
			FirstThreeParticipants: otherParticipants,
			ParticipantsCount:      uint32(count),
			CurrentUserId:          userID,
		})
	}

	return &schedulepb.SearchMeetingsResponse{
		Meetings: meetingResponses,
	}, nil
}

func (sr *ScheduleRepo) GetAllUsers(userID string, req *schedulepb.SearchParticipantsRequest) (*schedulepb.SearchParticipantsResponse, error) {
	var users []models.User

	db := sr.database.Model(&models.User{}).
		Where("id != ?", userID)

	if req.EmailQuery != "" {
		query := "%" + strings.ToLower(req.EmailQuery) + "%"
		db = db.Where("LOWER(email) LIKE ?", query)
	}

	// Optional pagination
	if req.LastId != nil {
		db = db.Where("meetings.id > ?", *req.LastId)
	}
	if req.PageSize > 0 {
		db = db.Limit(int(req.PageSize))
	}

	// Final query
	if err := db.Find(&users).Error; err != nil {
		return nil, status.Error(codes.Internal, "Failed to fetch users")
	}

	// Transform into protobuf response
	participants := make([]*schedulepb.MeetParticipant, 0, len(users))
	for _, u := range users {
		participants = append(participants, &schedulepb.MeetParticipant{
			Id:        u.ID,
			Email:     u.Email,
			Name:      u.RawUserMetaData.Name,
			AvatarUrl: u.RawUserMetaData.AvatarURL,
		})
	}

	return &schedulepb.SearchParticipantsResponse{
		Participants: participants,
	}, nil
}

// func (sr *ScheduleRepo) GetUsers(userID string) ([]models.User, error) {
// }

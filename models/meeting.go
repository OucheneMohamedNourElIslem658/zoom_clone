package models

import (
	"time"
)

type MeetingType string

const (
	MeetingTypeVideo MeetingType = "video"
	MeetingTypeAudio MeetingType = "audio"
)

type Meeting struct {
	ID                uint        `json:"id" gorm:"primaryKey"`
	Title             string      `json:"title"`
	Description       string      `json:"description"`
	StartTime         time.Time   `json:"start_time"`
	IsCancelled       bool        `json:"is_cancelled" gorm:"default:false"`
	Participants      []User      `json:"participants" gorm:"many2many:meet_participants;"`
	Type              MeetingType `json:"type" gorm:"type:varchar(16)"`
	ParticipantsCount int         `json:"participants_count" gorm:"-:migration;->"`
	CreatedAt         time.Time   `json:"created_at" gorm:"autoCreateTime"`
	DeletedAt         *time.Time  `json:"deleted_at,omitempty" gorm:"index"`
}

func (Meeting) TableName() string {
	return "public.meetings"
}

type MeetParticipant struct {
	MeetingID uint   `json:"meeting_id"`
	UserID    string `gorm:"type:uuid" json:"meet_space_profile_id"`
	RecordURL string `json:"record_url"`
	IsBanned  bool   `json:"is_banned"`
	IsHost    bool   `json:"is_host"`
}

func (MeetParticipant) TableName() string {
	return "public.meet_participants"
}

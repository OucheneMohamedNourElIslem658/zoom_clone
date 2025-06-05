package models

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
)

type RawUserMetadata struct {
	Iss        string `json:"iss"`
	Sub        string `json:"sub"`
	Name       string `json:"name"`
	Email      string `json:"email"`
	Picture    string `json:"picture"`
	FullName   string `json:"full_name"`
	AvatarURL  string `json:"avatar_url"`
	ProviderID string `json:"provider_id"`
	// CustomClaims  map[string]any `json:"custom_claims"`
	EmailVerified bool `json:"email_verified"`
	PhoneVerified bool `json:"phone_verified"`
}

type User struct {
	ID              string          `json:"id" gorm:"primaryKey;type:uuid"`
	Email           string          `json:"email" gorm:"-:migration;->"`
	RawUserMetaData RawUserMetadata `json:"raw_user_meta_data" gorm:"type:json;-:migration;->"`
}

func (r RawUserMetadata) Value() (driver.Value, error) {
	return json.Marshal(r)
}

func (r *RawUserMetadata) Scan(value interface{}) error {
	bytes, ok := value.([]byte)
	if !ok {
		return fmt.Errorf("failed to unmarshal RawUserMetadata value: %v", value)
	}
	return json.Unmarshal(bytes, r)
}

func (User) TableName() string {
	return "auth.users"
}

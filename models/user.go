package models

type User struct {
	ID string `json:"id" gorm:"primaryKey;type:uuid"`
}

func (User) TableName() string {
	return "auth.users"
}

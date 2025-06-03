package database

import (
	"log"

	"github.com/OucheneMohamedNourElIslem658/zoom_clone/config"
	"github.com/OucheneMohamedNourElIslem658/zoom_clone/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Instance *gorm.DB

func Init() {
	config := config.Load()

	dsn := config.GetDatabaseDSN()

	var err error
	Instance, err = gorm.Open(postgres.New(
		postgres.Config{
			DSN:                  dsn,
			PreferSimpleProtocol: true,
		},
	))

	if err != nil {
		panic(err)
	}

	log.Println("Database connected succesfully!")
}

func MigrateTables() {
	Init()
	err := Instance.AutoMigrate(
		&models.User{},
		&models.Meeting{},
		&models.MeetParticipant{},
	)
	if err != nil {
		panic(err)
	}

	log.Println("Database tables migrated successfully!")
}

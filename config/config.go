package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DBUser            string
	DBPassword        string
	DBHost            string
	DBPort            string
	DBName            string
	DBDns             string
	SupabaseProjectID string
	SupabaseAPIKey    string
	GRPCPort          string
	GRPCHost          string
	LiveKitAPIKey     string
	LiveKitAPISecret  string
	LiveKitURL        string
	StorageAccessKey  string
	StorageSecretKey  string
	StorageEndpoint   string
	StorageBucketName string
	StorageRegion     string
}

func Load() *Config {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Error loading .env file")
	}

	return &Config{
		DBUser:            os.Getenv("DB_USER"),
		DBPassword:        os.Getenv("DB_PASSWORD"),
		DBHost:            os.Getenv("DB_HOST"),
		DBPort:            os.Getenv("DB_PORT"),
		DBName:            os.Getenv("DB_NAME"),
		SupabaseProjectID: os.Getenv("SUPABASE_PROJECT_ID"),
		SupabaseAPIKey:    os.Getenv("SUPABASE_API_KEY"),
		GRPCPort:          os.Getenv("GRPC_PORT"),
		GRPCHost:          os.Getenv("GRPC_HOST"),
		LiveKitAPIKey:     os.Getenv("LIVEKIT_API_KEY"),
		LiveKitAPISecret:  os.Getenv("LIVEKIT_API_SECRET"),
		LiveKitURL:        os.Getenv("LIVEKIT_URL"),
		StorageAccessKey:  os.Getenv("STORAGE_ACCESS_KEY"),
		StorageSecretKey:  os.Getenv("STORAGE_SECRET_KEY"),
		StorageEndpoint:   os.Getenv("STORAGE_ENDPOINT"),
		StorageBucketName: os.Getenv("STORAGE_BUCKET_NAME"),
		StorageRegion:     os.Getenv("STORAGE_REGION"),
	}
}

func (config *Config) GetDatabaseDSN() string {
	return fmt.Sprintf(
		"host=%v user=%v password=%v dbname=%v port=%v",
		config.DBHost,
		config.DBUser,
		config.DBPassword,
		config.DBName,
		config.DBPort,
	)
}

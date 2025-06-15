package filestorage

import (
	"context"
	"fmt"
	"log"
	"net/url"
	"strings"
	"time"

	"github.com/OucheneMohamedNourElIslem658/zoom_clone/config"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

var Instance *minio.Client

func Init() {
	config := config.Load()

	parsedURL, err := url.Parse(config.StorageEndpoint)
	if err != nil {
		panic("Invalid STORAGE_ENDPOINT: " + err.Error())
	}

	host := parsedURL.Host
	if host == "" {
		host = strings.TrimPrefix(config.StorageEndpoint, "https://")
		host = strings.TrimPrefix(host, "http://")
	}

	// Determine whether to use HTTPS
	useSecure := parsedURL.Scheme == "https"

	Instance, err = minio.New(host, &minio.Options{
		Creds: credentials.NewStaticV4(
			config.StorageAccessKey,
			config.StorageSecretKey,
			"",
		),
		Secure: useSecure,
	})
	if err != nil {
		panic("Failed to initialize MinIO client: " + err.Error())
	}

	bucketExists, err := Instance.BucketExists(context.Background(), config.StorageBucketName)
	if err != nil {
		panic("Failed to check if bucket exists: " + err.Error())
	}

	if !bucketExists {
		panic("Bucket does not exist: " + config.StorageBucketName)
	}

	log.Println("File Storage client initialized successfully")
}

func GetRoomRecordings(meetingID string, userID string) ([]string, error) {
	config := config.Load()
	objectsPath := fmt.Sprintf("rooms/%v/%v/", meetingID, userID)
	objectsChannel := Instance.ListObjects(
		context.Background(),
		config.StorageBucketName,
		minio.ListObjectsOptions{
			Prefix: objectsPath,
		},
	)

	objectsURLs := []string{}

	for o := range objectsChannel {
		if o.Err != nil {
			return nil, o.Err
		}
		// Skip if not a folder (common in MinIO/S3: folders end with '/')
		if !strings.HasSuffix(o.Key, "/") {
			continue
		}

		// List objects inside the folder (o.Key)
		subObjects := Instance.ListObjects(
			context.Background(),
			config.StorageBucketName,
			minio.ListObjectsOptions{
				Prefix:    o.Key,
				Recursive: true,
			},
		)

		var urls []string
		for subObj := range subObjects {
			if subObj.Err != nil {
				return nil, subObj.Err
			}
			if strings.HasSuffix(subObj.Key, ".mp4") {
				presignedURL, err := Instance.PresignedGetObject(context.Background(), config.StorageBucketName, subObj.Key, time.Second * 24 * 60 * 60, nil)
				if err != nil {
					return nil, fmt.Errorf("failed to generate presigned URL: %w", err)
				}
				urls = append(urls, presignedURL.String())
			}
		}

		objectsURLs = append(objectsURLs, urls...)
	}

	return objectsURLs, nil
}

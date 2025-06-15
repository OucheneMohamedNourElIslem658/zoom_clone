package main

import (
	"context"
	"log"

	// "time"

	"google.golang.org/genproto/googleapis/rpc/errdetails"
	"google.golang.org/grpc"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"

	// "google.golang.org/protobuf/types/known/timestamppb"

	pb "github.com/OucheneMohamedNourElIslem658/zoom_clone/api/pb"
)

func main() {
	conn, err := grpc.Dial("localhost:50051", grpc.WithInsecure())
	if err != nil {
		log.Fatalf("Failed to connect: %v", err)
	}
	defer conn.Close()

	client := pb.NewScheduleServiceClient(conn)

	ctx := context.Background()
	token := "eyJhbGciOiJIUzI1NiIsImtpZCI6IlpxajVYVWl4S1U0Y3AwMHYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2tnanV3bHdsam9raGlkemx3ZmNoLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIzM2NlYzEwMi05MDI3LTRhZTYtYmUyMy1lOWIwODg3ZTg1Y2QiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQ5MjIzMjUzLCJpYXQiOjE3NDkyMTk2NTMsImVtYWlsIjoibV9vdWNoZW5lQGVzdGluLmR6IiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJnb29nbGUiLCJwcm92aWRlcnMiOlsiZ29vZ2xlIl19LCJ1c2VyX21ldGFkYXRhIjp7ImF2YXRhcl91cmwiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKWUE0NF9QZFlaVXA1azl4a2hxRjVsSWpVUC1TM00zcWNaOURtdzdCUFNrcTNFM1E9czk2LWMiLCJjdXN0b21fY2xhaW1zIjp7ImhkIjoiZXN0aW4uZHoifSwiZW1haWwiOiJtX291Y2hlbmVAZXN0aW4uZHoiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZnVsbF9uYW1lIjoibW9oYW1lZG5vdXJlbGlzbGVtIE9VQ0hFTkUiLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYW1lIjoibW9oYW1lZG5vdXJlbGlzbGVtIE9VQ0hFTkUiLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKWUE0NF9QZFlaVXA1azl4a2hxRjVsSWpVUC1TM00zcWNaOURtdzdCUFNrcTNFM1E9czk2LWMiLCJwcm92aWRlcl9pZCI6IjExNzE4MjQxOTExNzYxNTQ4MTk5NyIsInN1YiI6IjExNzE4MjQxOTExNzYxNTQ4MTk5NyJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6Im9hdXRoIiwidGltZXN0YW1wIjoxNzQ4ODkyMTA0fV0sInNlc3Npb25faWQiOiI0YzVkNjVlMi1lZjljLTQzN2QtODhkNS1jZmJjZDQxZTYzYjkiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.un06xtnH_Ske3-AWIOCPlLNmKobiw00OTRsT8oO2114"

	md := metadata.New(map[string]string{
		"authorization": "Bearer " + token,
	})
	ctx = metadata.NewOutgoingContext(ctx, md)
	title := "mooh"
	resp, err := client.SearchParticipants(ctx, &pb.SearchParticipantsRequest{
		EmailQuery: title,
	})
	if err != nil {
		st, _ := status.FromError(err)
		for _, detail := range st.Details() {
			if br, ok := detail.(*errdetails.BadRequest); ok {
				for _, fv := range br.GetFieldViolations() {
					log.Printf("  Field: %s, Reason: %s, Description: %s", fv.GetField(), fv.GetReason(), fv.GetDescription())
				}
			} else {
				log.Printf("  Unknown detail type: %T, Value: %+v", detail, detail)
			}
		}
		return
	}

	log.Println(resp)
}
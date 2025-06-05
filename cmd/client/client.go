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
	// Example: Call CreateMeeting method from the ScheduleService gRPC server

	// Import necessary packages
	// "context"
	// "log"
	// pb "github.com/OucheneMohamedNourElIslem658/zoom_clone/api/pb"
	// "google.golang.org/grpc"

	conn, err := grpc.Dial("localhost:50051", grpc.WithInsecure())
	if err != nil {
		log.Fatalf("Failed to connect: %v", err)
	}
	defer conn.Close()

	client := pb.NewScheduleServiceClient(conn)

	// tomorrow := timestamppb.New(time.Now().Add(24 * time.Hour))
	// req := &pb.CreateMeetingRequest{
	// 	Title:         "Test Meeting",
	// 	Description:   "A test meeting from client",
	// 	StartTime:     tomorrow,
	// 	ParticipantIds: []string{
	// 		"33cec102-9027-4ae6-be23-e9b0887e85cd",
	// 	},
	// }
	ctx := context.Background()
	token := "eyJhbGciOiJIUzI1NiIsImtpZCI6IlpxajVYVWl4S1U0Y3AwMHYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2tnanV3bHdsam9raGlkemx3ZmNoLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJkNWIzNDgxMS1mOTVhLTQxOTctYTVlYS1kZTg5YjgyOWMwYmMiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQ5MTYyMzIxLCJpYXQiOjE3NDkxNTg3MjEsImVtYWlsIjoib3VjaGVuZW1vaGFtZWRub3VyZWxpc2xhbUBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6Imdvb2dsZSIsInByb3ZpZGVycyI6WyJnb29nbGUiXX0sInVzZXJfbWV0YWRhdGEiOnsiYXZhdGFyX3VybCI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0pQdkJmSkxkYkxSWVVwdWhSZlN5Z2RUaGFWSVJHSERBT0RBVTRUbmRMNEQ2YUJCUT1zOTYtYyIsImVtYWlsIjoib3VjaGVuZW1vaGFtZWRub3VyZWxpc2xhbUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZnVsbF9uYW1lIjoiTW9oYW1lZCBOb3VyIEVsIElzbGFtIE91Y2hlbmUiLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYW1lIjoiTW9oYW1lZCBOb3VyIEVsIElzbGFtIE91Y2hlbmUiLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKUHZCZkpMZGJMUllVcHVoUmZTeWdkVGhhVklSR0hEQU9EQVU0VG5kTDRENmFCQlE9czk2LWMiLCJwcm92aWRlcl9pZCI6IjExMTE4NzA5NTM1MTQ1MDU4NTIxMyIsInN1YiI6IjExMTE4NzA5NTM1MTQ1MDU4NTIxMyJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6Im9hdXRoIiwidGltZXN0YW1wIjoxNzQ5MTU1MTAxfV0sInNlc3Npb25faWQiOiJmYjlkYWU3OC1kMTljLTRiMjctYTNjYS1kOTNhYzBjNzY1OWEiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.3ypTzoOp50HVW83JHJR_HT6xalJmYQvbyNdg7-Jaa1M"

	md := metadata.New(map[string]string{
		"authorization": "Bearer " + token,
	})
	ctx = metadata.NewOutgoingContext(ctx, md)
	// var lastid uint32 = 3
	resp, err := client.SearchMeetings(ctx, &pb.SearchMeetingsRequest{
		PageSize: 0,
	})
	log.Println(err)
	if err != nil {
		st, _ := status.FromError(err)
		log.Println("Validation errors:")
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
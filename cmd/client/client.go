package main

import (
	"context"
	"log"

	"google.golang.org/genproto/googleapis/rpc/errdetails"
	"google.golang.org/grpc"
	"google.golang.org/grpc/status"

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

	req := &pb.CreateMeetingRequest{
		Title:        "Test Meeting",
		Description:  "A test meeting from client",
	}
	_, err = client.CreateMeeting(context.Background(), req)
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
	}
}
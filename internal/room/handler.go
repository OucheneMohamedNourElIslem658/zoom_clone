package room

import (
	"context"
	"log"

	pb "github.com/OucheneMohamedNourElIslem658/zoom_clone/api/pb"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type RoomHandler struct {
	roomRepo *RoomRepository
	pb.UnimplementedRoomServiceServer
}

func NewRoomHandler() *RoomHandler {
	return &RoomHandler{
		roomRepo: NewRoomRepository(),
	}
}

func (s *RoomHandler) JoinRoom(ctx context.Context, req *pb.JoinRoomRequest) (*pb.JoinRoomResponse, error) {
	userID, ok := ctx.Value("user_id").(string)
	if !ok || userID == "" {
		return nil, status.Error(codes.Unauthenticated, "requester is not authenticated")
	}

	token, err := s.roomRepo.JoinRoom(userID, uint(req.MeetingId))
	if err != nil {
		log.Printf("failed to join room: %v", err)
		return nil, status.Error(codes.Internal, "failed to join room")
	}

	return &pb.JoinRoomResponse{
		Token: *token,
	}, nil
}

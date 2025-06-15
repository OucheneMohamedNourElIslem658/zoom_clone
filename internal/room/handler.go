package room

import (
	"context"

	pb "github.com/OucheneMohamedNourElIslem658/zoom_clone/api/pb"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/emptypb"
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

	token, err := s.roomRepo.JoinRoom(userID, req.MeetingId)
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to join room")
	}

	return &pb.JoinRoomResponse{
		Token: *token,
	}, nil
}

func (s *RoomHandler) RecordRoom(ctx context.Context, req *pb.RecordRoomRequest) (*emptypb.Empty, error) {
	userID, ok := ctx.Value("user_id").(string)
	if !ok || userID == "" {
		return nil, status.Error(codes.Unauthenticated, "requester is not authenticated")
	}

	err := s.roomRepo.RecordRoom(userID, req.MeetingId)
	if err != nil {
		return nil, err
	}
	return nil, status.Errorf(codes.Unimplemented, "method RecordRoom not implemented")
}

func (s *RoomHandler) StopRecording(ctx context.Context, req *pb.RecordRoomRequest) (*emptypb.Empty, error) {
	userID, ok := ctx.Value("user_id").(string)
	if !ok || userID == "" {
		return nil, status.Error(codes.Unauthenticated, "requester is not authenticated")
	}

	err := s.roomRepo.StopRecording(userID, req.MeetingId)
	if err != nil {
		return nil, err
	}

	return &emptypb.Empty{}, nil
}

func (s *RoomHandler) GetRecording(ctx context.Context, req *pb.GetRecordingRequest) (*pb.GetRecordingResponse, error) {
	userID, ok := ctx.Value("user_id").(string)
	if !ok || userID == "" {
		return nil, status.Error(codes.Unauthenticated, "requester is not authenticated")
	}

	urls, err := s.roomRepo.GetRoomRecordings(userID, req.MeetingId)
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to get room recordings: "+err.Error())
	}

	return &pb.GetRecordingResponse{
		Urls: urls,
	}, nil
}

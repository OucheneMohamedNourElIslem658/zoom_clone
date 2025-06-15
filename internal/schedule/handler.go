package schedule

import (
	"context"

	pb "github.com/OucheneMohamedNourElIslem658/zoom_clone/api/pb"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/emptypb"
)

type ScheduleHandler struct {
	scheduleRepo *ScheduleRepo
	pb.UnimplementedScheduleServiceServer
}

func NewScheduleHandler() *ScheduleHandler {
	return &ScheduleHandler{
		scheduleRepo: NewScheduleRepo(),
	}
}

func (sh *ScheduleHandler) CreateMeeting(ctx context.Context, req *pb.CreateMeetingRequest) (*emptypb.Empty, error) {
	userID, ok := ctx.Value("user_id").(string)
	if !ok {
		return nil, status.Errorf(codes.Unauthenticated, "Requester is not authenticated")
	}

	err := sh.scheduleRepo.CreateMeeting(userID, req)
	if err != nil {
		return nil, err
	}

	return &emptypb.Empty{}, nil
}

func (sh *ScheduleHandler) UpdateMeeting(ctx context.Context, req *pb.UpdateMeetingRequest) (*emptypb.Empty, error) {
	userID, ok := ctx.Value("user_id").(string)

	if !ok {
		return nil, status.Errorf(codes.Unauthenticated, "Requester is not authenticated")
	}

	err := sh.scheduleRepo.UpdateMeeting(userID, req)
	if err != nil {
		return nil, err
	}

	return &emptypb.Empty{}, nil
}

func (sh *ScheduleHandler) GetMeeting(ctx context.Context, req *pb.GetMeetingRequest) (*pb.Meeting, error) {
	userID, ok := ctx.Value("user_id").(string)
	if !ok {
		return nil, status.Errorf(codes.Unauthenticated, "Requester is not authenticated")
	}

	result, err := sh.scheduleRepo.GetMeeting(userID, req)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (sh *ScheduleHandler) SearchMeetings(ctx context.Context, req *pb.SearchMeetingsRequest) (*pb.SearchMeetingsResponse, error) {
	userID, ok := ctx.Value("user_id").(string)
	if !ok {
		return nil, status.Errorf(codes.Unauthenticated, "Requester is not authenticated")
	}

	result, err := sh.scheduleRepo.GetAllMeetings(userID, req)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (sh *ScheduleHandler) SearchParticipants(ctx context.Context, req *pb.SearchParticipantsRequest) (*pb.SearchParticipantsResponse, error) {
	userID, ok := ctx.Value("user_id").(string)
	if !ok {
		return nil, status.Errorf(codes.Unauthenticated, "Requester is not authenticated")
	}

	result, err := sh.scheduleRepo.GetAllUsers(userID, req)
	if err != nil {
		return nil, err
	}

	return result, nil
}
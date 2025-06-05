package schedule

import (
	"context"
	"log"

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

func (sh *ScheduleHandler) CreateMeeting(ctx context.Context, req *pb.CreateMeetingRequest) (res *emptypb.Empty, err error) {
	userID, ok := ctx.Value("user_id").(string)
	log.Println("userID:", userID)
	if !ok {
		return nil, status.Errorf(codes.Unauthenticated, "Requester is not authenticated")
	}

	err = sh.scheduleRepo.CreateMeeting(userID, req)
	if err != nil {
		return nil, err
	}

	return &emptypb.Empty{}, nil
}
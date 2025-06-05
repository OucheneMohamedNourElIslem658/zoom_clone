package schedule

import (
	"context"

	"buf.build/go/protovalidate"
	pb "github.com/OucheneMohamedNourElIslem658/zoom_clone/api/pb"
	"github.com/OucheneMohamedNourElIslem658/zoom_clone/pkg/utils"
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

func (sh *ScheduleHandler) CreateMeeting(ctx context.Context, req *pb.CreateMeetingRequest) (res *pb.CreateMeetingResponse, err error) {
	vErr := protovalidate.Validate(req).(*protovalidate.ValidationError)
	if vErr != nil {
		return nil, utils.ParseValidationError(vErr)
	}

	return nil, nil
}
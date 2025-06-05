package interceptors

import (
	"context"

	"buf.build/go/protovalidate"
	"github.com/OucheneMohamedNourElIslem658/zoom_clone/pkg/utils"
	"google.golang.org/grpc"
	"google.golang.org/protobuf/proto"
)

func Validation() grpc.UnaryServerInterceptor {
	return func(
		ctx context.Context, 
		req any, 
		info *grpc.UnaryServerInfo, 
		handler grpc.UnaryHandler,
	) (resp any, err error) {
		if err := protovalidate.Validate(req.(proto.Message)); err != nil {
			if vErr, ok := err.(*protovalidate.ValidationError); ok {
				return nil, utils.ParseValidationError(vErr)
			}
			return nil, err
		}

		return handler(ctx, req)
	}
}
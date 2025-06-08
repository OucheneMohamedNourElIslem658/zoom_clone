package interceptors

import (
	"context"
	"log"
	
	"google.golang.org/grpc"
)

func Logger() grpc.UnaryServerInterceptor {
	return func(
		ctx context.Context,
		req any,
		info *grpc.UnaryServerInfo,
		handler grpc.UnaryHandler,
	) (any, error) {
		log.Println(info.FullMethod)
		return handler(ctx, req)
	}
}
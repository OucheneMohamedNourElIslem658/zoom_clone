package interceptors

import (
	"context"
	"strings"

	"github.com/OucheneMohamedNourElIslem658/zoom_clone/pkg/auth"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

type contextKey string

const (
	ContextKeyID       contextKey = "id"
	ContextKeyAuthorID contextKey = "author_id"
)

func Authorization() grpc.UnaryServerInterceptor {
	return func(
		ctx context.Context,
		req any,
		info *grpc.UnaryServerInfo,
		handler grpc.UnaryHandler,
	) (any, error) {
		md, ok := metadata.FromIncomingContext(ctx)
		if ok {
			authHeaders := md.Get("authorization")
			if len(authHeaders) == 0 {
				return handler(ctx, req)
			}

			authorization := authHeaders[0]
			if strings.HasPrefix(authorization, "Bearer ") {
				accessToken := strings.TrimPrefix(authorization, "Bearer ")
				if accessToken != "" {
					authInstance := auth.Instance
					authInstance = authInstance.WithToken(accessToken)
					user, err := authInstance.GetUser()
					if err != nil {
						return nil, status.Error(codes.Unauthenticated, "unauthorized")
					}

					userID := user.ID.String()
					ctx = context.WithValue(ctx, "user_id", userID)
				}
			}
		}

		return handler(ctx, req)
	}
}
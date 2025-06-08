package main

import (
	"log"
	"net"

	"github.com/OucheneMohamedNourElIslem658/zoom_clone/config"
	"github.com/OucheneMohamedNourElIslem658/zoom_clone/internal/interceptors"
	"github.com/OucheneMohamedNourElIslem658/zoom_clone/pkg/auth"
	"github.com/OucheneMohamedNourElIslem658/zoom_clone/pkg/database"
	schedule "github.com/OucheneMohamedNourElIslem658/zoom_clone/internal/schedule"
	pb "github.com/OucheneMohamedNourElIslem658/zoom_clone/api/pb"
	"google.golang.org/grpc"
)

func init() {
	database.Init()
	auth.Init()
}

func main()  {
	config := config.Load()

	// Initialize the tcp listener
	lis, err := net.Listen("tcp", config.GRPCHost+":"+config.GRPCPort)
	if err != nil {
		log.Fatalf("Failed to listen on %s:%s: %v", config.GRPCHost, config.GRPCPort, err)
	}
	defer lis.Close()

	// Create a new gRPC server
	grpcServer := grpc.NewServer(
		grpc.ChainUnaryInterceptor(
			interceptors.Logger(),
			interceptors.Authorization(),
			interceptors.Validation(),
		),
	)

	// Register your gRPC services here
	scheduleHandler := schedule.NewScheduleHandler()
	pb.RegisterScheduleServiceServer(grpcServer, scheduleHandler)

	// Run the gRPC server
	log.Printf("gRPC server is running on %s:%s", config.GRPCHost, config.GRPCPort)
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("Failed to serve gRPC server: %v", err)
	}
}
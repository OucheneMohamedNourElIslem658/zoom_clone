package main

import (
	"log"
	"net"

	"github.com/OucheneMohamedNourElIslem658/zoom_clone/config"
	"github.com/OucheneMohamedNourElIslem658/zoom_clone/internal/interceptors"
	"github.com/OucheneMohamedNourElIslem658/zoom_clone/pkg/auth"
	"github.com/OucheneMohamedNourElIslem658/zoom_clone/pkg/database"
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
		grpc.UnaryInterceptor(interceptors.Authorization()),
	)

	// Register your gRPC services here
	// ...

	// Run the gRPC server
	log.Printf("gRPC server is running on %s:%s", config.GRPCHost, config.GRPCPort)
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("Failed to serve gRPC server: %v", err)
	}
}
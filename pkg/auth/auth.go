package auth

import (
	"github.com/OucheneMohamedNourElIslem658/zoom_clone/config"
	"github.com/supabase-community/auth-go"
)

var Instance auth.Client;

func Init() {
	config := config.Load()
	Instance = auth.New(
		config.SupabaseProjectID,
		config.SupabaseAPIKey,
	)
}
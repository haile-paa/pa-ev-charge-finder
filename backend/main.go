package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/haile-paa/pa-ev-charge-finder/config"
	"github.com/haile-paa/pa-ev-charge-finder/handlers"
	"github.com/haile-paa/pa-ev-charge-finder/middleware"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	// Load configuration
	cfg := config.LoadConfig()

	// Connect to MongoDB
	client, err := mongo.NewClient(options.Client().ApplyURI(cfg.MongoURI))
	if err != nil {
		log.Fatal(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(ctx)

	// Check connection
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to MongoDB!")

	// Get collection
	collection := client.Database(cfg.DBName).Collection("cars")

	// Initialize Gin
	r := gin.Default()

	// Middleware
	r.Use(middleware.CORSMiddleware(cfg.AllowedOrigin))

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(collection, cfg)
	//telegram bot
	// if cfg.TelegramBotToken != "" {
	// 	go handlers.StartTelegramBot(cfg.TelegramBotToken)
	// } else {
	// 	log.Println("TELEGRAM_BOT_TOKEN not set, skipping Telegram bot startup")
	// }

	// Routes
	r.POST("/registerCar", authHandler.RegisterCar)
	r.POST("/login", authHandler.Login)

	// Start server
	fmt.Printf("Server running on port %s\n", cfg.Port)
	r.Run(":" + cfg.Port)
}

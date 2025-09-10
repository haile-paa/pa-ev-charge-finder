package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	MongoURI  string
	JWTSecret string
	DBName    string
	Port      string
	// AllowedOrigin string
	// TelegramBotToken string
}

func LoadConfig() *Config {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	return &Config{
		MongoURI:  getEnv("MONGO_URI", "mongodb://localhost:27017"),
		JWTSecret: getEnv("JWT_SECRET", "fallback-secret-key"),
		DBName:    getEnv("DB_NAME", "users"),
		Port:      getEnv("PORT", "4000"),
		// AllowedOrigin: getEnv("ALLOWED_ORIGIN", "http://localhost:8081"),
		// TelegramBotToken: getEnv("TELEGRAM_BOT_TOKEN", ""),
	}
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

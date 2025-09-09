package handlers

import (
	"context"
	"net/http"
	"time"

	"github.com/haile-paa/pa-ev-charge-finder/config"
	"github.com/haile-paa/pa-ev-charge-finder/models"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type AuthHandler struct {
	collection *mongo.Collection
	config     *config.Config
}

func NewAuthHandler(collection *mongo.Collection, config *config.Config) *AuthHandler {
	return &AuthHandler{
		collection: collection,
		config:     config,
	}
}

func (h *AuthHandler) RegisterCar(c *gin.Context) {
	var car models.Car
	if err := c.ShouldBindJSON(&car); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if car already exists with the same email and phone
	existingCar := models.Car{}
	err := h.collection.FindOne(context.TODO(), bson.M{
		"email": car.Email,
		"phone": car.Phone,
	}).Decode(&existingCar)

	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Car already registered with this email and phone"})
		return
	} else if err != mongo.ErrNoDocuments {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Set timestamps
	now := time.Now()
	car.CreatedAt = now
	car.UpdatedAt = now

	// Insert into database
	result, err := h.collection.InsertOne(context.TODO(), car)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register car"})
		return
	}

	// Generate JWT token
	token, err := h.generateToken(car.Email, car.Phone)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	// Set the ID from the result
	car.ID = result.InsertedID.(primitive.ObjectID)

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"car":   car,
	})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var loginReq models.LoginRequest
	if err := c.ShouldBindJSON(&loginReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Find car in database
	var car models.Car
	err := h.collection.FindOne(context.TODO(), bson.M{
		"email": loginReq.Email,
		"phone": loginReq.Phone,
	}).Decode(&car)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		}
		return
	}

	// Generate JWT token
	token, err := h.generateToken(car.Email, car.Phone)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"car":   car,
	})
}

func (h *AuthHandler) generateToken(email, phone string) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &models.Claims{
		Email: email,
		Phone: phone,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(h.config.JWTSecret))
}

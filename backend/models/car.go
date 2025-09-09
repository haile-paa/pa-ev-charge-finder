package models

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Car struct {
	ID              primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Email           string             `bson:"email" json:"email"`
	Phone           string             `bson:"phone" json:"phone"`
	CarType         string             `bson:"carType" json:"carType"`
	CarModel        string             `bson:"carModel" json:"carModel"`
	LicensePlate    string             `bson:"licensePlate" json:"licensePlate"`
	Color           string             `bson:"color,omitempty" json:"color,omitempty"`
	OwnerNote       string             `bson:"ownerNote,omitempty" json:"ownerNote,omitempty"`
	Insurance       string             `bson:"insurance,omitempty" json:"insurance,omitempty"`
	BatteryCapacity string             `bson:"batteryCapacity" json:"batteryCapacity"`
	TirePressure    string             `bson:"tirePressure" json:"tirePressure"`
	CreatedAt       time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt       time.Time          `bson:"updatedAt" json:"updatedAt"`
}

type LoginRequest struct {
	Email string `json:"email" binding:"required"`
	Phone string `json:"phone" binding:"required"`
}

type Claims struct {
	Email string `json:"email"`
	Phone string `json:"phone"`
	jwt.RegisteredClaims
}

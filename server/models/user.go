package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID               primitive.ObjectID `bson:"_id"`
	First_name       *string            `json:"first_name"`
	Last_Name        *string            `json:"last_name"`
	Password         *string            `json:"password"`
	Pass             string             `json:"pass"`
	Email            *string            `json:"email"`
	Token            *string            `json:"token"`
	User_type        *string            `json:"user_type"`
	Refresh_token    *string            `json:"refresh_token"`
	Created_at       time.Time          `json:"created_at"`
	Updated_at       time.Time          `json:"updated_at"`
	User_id          string             `json:"user_id"`
	Activation_token string             `json:"activationtoken"`
	Is_activated     int                `json:"isactivated"`
	// Links         []Response         `json:"links"`
}

type UpdateUser struct {
	First_name   *string   `json:"first_name"`
	Last_Name    *string   `json:"last_name"`
	Email        *string   `json:"email"`
	Updated_at   time.Time `json:"updated_at"`
	User_type    *string   `json:"user_type"`
	Is_activated int       `json:"isactivated"`
}

type ViewUsers struct {
	Ip    string        `json:"ip,omitempty"`
	Quota string        `json:"quota,omitempty"`
	Reset time.Duration `json:"reset,omitempty"`
}

package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Request struct {
	URL    string        `json:"url"`
	Short  string        `json:"short"`
	Expiry time.Duration `json:"expiry"`
}

type Response struct {
	URL_ID          string        `json:"url_id"`
	URL             string        `json:"url"`
	Short           string        `json:"short"`
	Expiry          time.Duration `json:"expiry"`
	XrateReaminimg  int           `json:"rate_limit"`
	XrateLimitReset time.Duration `json:"rate_limit_reset"`
}

type User struct {
	ID            primitive.ObjectID `bson:"_id"`
	First_name    *string            `json:"first_name"`
	Last_Name     *string            `json:"last_name"`
	Password      *string            `json:"password"`
	Pass          string             `json:"pass"`
	Email         *string            `json:"email"`
	Token         *string            `json:"token"`
	User_type     *string            `json:"user_type"`
	Refresh_token *string            `json:"refresh_token"`
	Created_at    time.Time          `json:"created_at"`
	Updated_at    time.Time          `json:"updated_at"`
	User_id       string             `json:"user_id"`
	Links         []Response         `json:"links"`
}

type ViewUsers struct {
	Ip    string        `json:"ip,omitempty"`
	Quota string        `json:"quota,omitempty"`
	Reset time.Duration `json:"reset,omitempty"`
}

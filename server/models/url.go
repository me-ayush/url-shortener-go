package models

import (
	"time"
)

type Request struct {
	URL            string    `json:"url"`
	Short          string    `json:"short"`
	Addedby        string    `json:"addedby"`
	User           string    `json:"User"`
	Clicks         string    `json:"clicks"`
	Expiry         time.Time `json:"deactivation_from"`
	ExpiryDays     int       `json:"days"`
	ActivationTime time.Time `json:"activation_from"`
}

type Response struct {
	URL_ID         string    `json:"url_id"`
	URL            string    `json:"url"`
	Short          string    `json:"short"`
	Addedby        string    `json:"addedby"`
	User           string    `json:"User"`
	Clicks         string    `json:"clicks"`
	Expiry         time.Time `json:"expiry"`
	ExpiryAt       string    `json:"expiryat"`
	ActivationTime time.Time `json:"activation_from"`
	// XrateReaminimg  int           `json:"rate_limit"`
	// XrateLimitReset time.Duration `json:"rate_limit_reset"`
}

package models

import (
	"time"
)

type Request struct {
	URL        string    `json:"url"`
	Short      string    `json:"short"`
	Addedby    string    `json:"addedby"`
	User       string    `json:"User"`
	Clicks     string    `json:"clicks"`
	Expiry     time.Time `json:"expiry"`
	ExpiryDays int       `json:"days"`
	ExpiryAt   string    `json:"expiryat"`
}

type Response struct {
	URL_ID   string    `json:"url_id"`
	URL      string    `json:"url"`
	Short    string    `json:"short"`
	Addedby  string    `json:"addedby"`
	User     string    `json:"User"`
	Clicks   string    `json:"clicks"`
	Expiry   time.Time `json:"expiry"`
	ExpiryAt string    `json:"expiryat"`
	// XrateReaminimg  int           `json:"rate_limit"`
	// XrateLimitReset time.Duration `json:"rate_limit_reset"`
}

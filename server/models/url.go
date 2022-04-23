package models

import (
	"time"
)

type Request struct {
	URL     string        `json:"url"`
	Short   string        `json:"short"`
	Addedby string        `json:"addedby"`
	User    string        `json:"User"`
	Expiry  time.Duration `json:"expiry"`
}

type Response struct {
	URL_ID          string        `json:"url_id"`
	URL             string        `json:"url"`
	Short           string        `json:"short"`
	Addedby         string        `json:"addedby"`
	User            string        `json:"User"`
	Expiry          time.Duration `json:"expiry"`
	XrateReaminimg  int           `json:"rate_limit"`
	XrateLimitReset time.Duration `json:"rate_limit_reset"`
}

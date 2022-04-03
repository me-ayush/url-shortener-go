package models

import "time"

type Request struct {
	URL    string        `json:"url"`
	Short  string        `json:"short"`
	Expiry time.Duration `json:"expiry"`
}

type Response struct {
	URL             string        `json:"url"`
	Short           string        `json:"short"`
	Expiry          time.Duration `json:"expiry"`
	XrateReaminimg  int           `json:"rate_limit"`
	XrateLimitReset time.Duration `json:"rate_limit_reset"`
}

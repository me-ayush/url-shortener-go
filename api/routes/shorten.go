package routes

imnport(
	"time"
)

type request struct{
	URl string	`json:"url"`
	CustomShort string `json:"short"`
	Expiry time.Duration	`json:"expiry"`
}

type response struct{
	URl	string	`json:"url"`
	CustomShort string `json:"url"`
	Expiry time.Duration `json"expiry"`
	XrateReaminimg int `json:"rate_limit"`
	XrateLimitRest time.Duration `json:"rate_limit_reset"`
}
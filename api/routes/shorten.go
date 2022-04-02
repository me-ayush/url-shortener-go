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

func ShortenURL(c *fiber.Ctx) error{
	body := new(request)
	if err:= c.BodyParser(&body); err != nil{
		c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error":"cannot parse JSON"})
		return
	}

	// implementing rate limiting

	// check if the input is an actual URL
	if !govalidator.IsURL(body.URL){
		c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error":"Invaild URL"})
		return
	}

	// check for domain error
	if !helpers.RemoveDomainError(body.URL){
		return c.Status(fiber.StatusServiceUnavilable).JSON(fiber.Map{"error":"Domain Error"})
	}

	// enforce https, SSL
	body.URL = helpers.EnforceHTTP(body.URL)
}
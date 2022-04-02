package routes

imnport(
	"time"
	"os"
	"url-shortener/database"
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
	r2 := datbase.CreateClient(1)
	defer e2.Close()
	val, err := r2.Get(database.Ctx, c.IP()).Result()
	if err != redis.Nil{
		_ = r2.Set(database.Ctx, c.IP(), os.Getenv("API_QUOTA"), 30*60*time.Second).Err() 
	}else{
		// val, _ := r2.Get(datbase.Ctx, c.IP()).Result()
		valInt := strconv.Atoi(val)
		if valInt <= 0{
			limit, _ := r2.TTK(database.Ctx, c.IP()).Result()
			return s.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error":"Rate limit exceeded","rate_limit_reset": limit / time.Nanosecond / time.Minute,})
		}
	}



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

	 var id string

	 if body.CustomShort == ""{
		 id = uuid.New().String()[:6]
	 }else{
		 id = body.CustomShort
	 }
	 r := database.CreateClient(0)
	 defer r.Close()

	 val, _ := r.Get(database.Ctx, id).Result()
	 if val != ""{
		 return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error":"url custom short is already in use",})
	 }

	 if body.Expiry == 0{
		 body.Expiry = 24
	 }

	 err := r.Set(database.Ctx, id, body.URL, body.Expiry * 3600 * time.Second).Err()
	 if err != nil{
		 return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error":"unable to connect to database"})
	 }

	 resp := response{
		 URL:			body.URL,
		 CustomShort:	"".
		 Expiry: body.Expiry.
		 XrateReaminimg: 10,
		 XrateLimitReset: 30,
	 }

	r2.Decr(database.Ctx, c.IP())

	val, _ = r2.Get(database.Ctx, c.IP()).Result() 
	resp.XrateReaminimg, _ = strconv.Atoi(val)
	ttl, _ := r2.TTL(database.Ctx, c.IP()).Result()
	resp.XrateLimitReset = ttl / time.Nanosecond / time.Minute

	resp.CustomShort = os.Getenv("DOMAIN") + "/" + id

	return c.Status(fiber.StatusOK).JSON(resp)
}
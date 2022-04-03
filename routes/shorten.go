package routes

import (
	"context"
	"log"
	"os"
	"strconv"
	"time"

	"url-shortener/database"
	"url-shortener/helpers"
	"url-shortener/models"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"

	"github.com/asaskevich/govalidator"
	"github.com/google/uuid"
)

func ShortenURL(c *fiber.Ctx) error {
	body := new(models.Request)
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "cannot parse JSON"})
	}

	mdb := database.OpenCollection(database.Client, "url-viewers")
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)

	// implementing rate limiting
	var val models.ViewUsers
	err := mdb.FindOne(ctx, bson.M{"ip": c.IP()}).Decode(&val)
	defer cancel()
	if err != nil {
		var viewer models.ViewUsers = models.ViewUsers{
			Ip:    c.IP(),
			Quota: os.Getenv("API_QUOTA"),
			Reset: 30 * 60 * time.Second,
		}
		_, err := mdb.InsertOne(ctx, viewer)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "cannot connect to database"})
		}
	}
	valInt, _ := strconv.Atoi(val.Quota)
	if valInt <= 0 {
		limit := val.Reset
		return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "Rate limit exceeded", "rate_limit_reset": limit / time.Nanosecond / time.Minute})
	} else {
		// val.Quota = strconv.Itoa(valInt - 1)
		_, err = mdb.UpdateOne(ctx,
			bson.M{"ip": val.Ip},
			bson.D{
				{"$set", bson.D{{"quota", val.Quota}}},
			},
		)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "cannot connect to database"})
		}
	}

	// check if the input is an actual URL
	if !govalidator.IsURL(body.URL) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invaild URL"})
	}

	// check for domain error
	if !helpers.RemoveDomainError(body.URL) {
		return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "Domain Error"})
	}

	// enforce https, SSL
	body.URL = helpers.EnforceHTTP(body.URL)

	var id string

	// fmt.Println(body)
	if body.Short == "" {
		id = uuid.New().String()[:6]
		body.Short = id
	} else {
		id = body.Short
	}

	// r := database.CreateClient(0)
	mdb = database.OpenCollection(database.Client, "shorten-urls")
	// ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	count, err := mdb.CountDocuments(ctx, bson.M{"short": id})
	// fmt.Println(count)
	if err != nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "cannot connect to datavbase"})
	}
	if count > 0 {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "custom short is already in use"})
	}

	if body.Expiry == 0 {
		body.Expiry = 24
	}

	body.Expiry = body.Expiry * 3600 * time.Second

	_, err = mdb.InsertOne(ctx, body)
	defer cancel()
	if err != nil {
		log.Fatal(err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "unable to connect to database"})
	}

	resp := models.Response{
		URL:             body.URL,
		Short:           body.Short,
		Expiry:          body.Expiry,
		XrateReaminimg:  10,
		XrateLimitReset: 30,
	}

	// r2.Decr(database.Ctx, c.IP())

	// val, _ = r2.Get(database.Ctx, c.IP()).Result()
	// resp.XrateReaminimg, _ = strconv.Atoi(val)
	// ttl, _ := r2.TTL(database.Ctx, c.IP()).Result()
	// resp.XrateLimitReset = ttl / time.Nanosecond / time.Minute

	// resp.CustomShort = os.Getenv("DOMAIN") + "/" + id

	return c.Status(fiber.StatusOK).JSON(resp)
}

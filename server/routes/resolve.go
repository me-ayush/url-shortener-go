package routes

import (
	"context"
	"strconv"
	"time"
	"url-shortener/database"
	"url-shortener/models"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var mdb *mongo.Collection = database.OpenCollection(database.Client, "shorten-urls")

func ResolveURL(c *fiber.Ctx) error {
	url := c.Params("url")

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)

	var urlDetail models.Response

	err := mdb.FindOne(ctx, bson.M{"short": url}).Decode(&urlDetail)
	defer cancel()
	if err != nil {
		return c.Status(fiber.StatusNotFound).Render("404", fiber.Map{
			"Msg": "404 Not Found",
		})
	}

	x, _ := strconv.Atoi(urlDetail.Clicks)
	// fmt.Println(x)
	urlDetail.Clicks = strconv.Itoa(x + 1)

	_, _ = mdb.UpdateOne(ctx,
		bson.M{"short": urlDetail.Short},
		bson.M{"$set": urlDetail},
	)

	return c.Redirect(urlDetail.URL, 301)
}

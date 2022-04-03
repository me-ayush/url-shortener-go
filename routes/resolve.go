package routes

import (
	"context"
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
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "short not found"})
	}

	return c.Redirect(urlDetail.URL, 301)
}

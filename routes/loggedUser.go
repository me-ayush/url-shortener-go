package routes

import (
	"context"
	"time"
	"url-shortener/database"
	"url-shortener/models"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
)

func UserDetails(c *fiber.Ctx) error {
	userId := c.Params("user_id")

	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	mdb := database.OpenCollection(database.Client, "users")
	var user models.User
	err := mdb.FindOne(ctx, bson.M{"email": userId}).Decode(&user)
	defer cancel()
	if err != nil {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(user)
}

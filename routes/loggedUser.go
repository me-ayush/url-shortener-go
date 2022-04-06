package routes

import (
	"context"
	"time"
	"url-shortener/controllers"
	"url-shortener/database"
	"url-shortener/helpers"
	"url-shortener/models"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
)

func UserDetails(c *fiber.Ctx) error {
	userId := c.Params("user_id")

	if err := helpers.MatchuserTypeToUid(c, userId); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	mdb := database.OpenCollection(database.Client, "users")
	var user models.User
	err := mdb.FindOne(ctx, bson.M{"user_id": userId}).Decode(&user)
	defer cancel()
	if err != nil {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(user)
}

func AddURL(c *fiber.Ctx) error {
	body := new(models.Request)
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "cannot parse JSON"})
	}
	msg, resp, err := controllers.ShortTheURL(*body)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": msg})
	}

	mdb := database.OpenCollection(database.Client, "users")
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)

	userId := c.Locals("uid")

	query := bson.M{"user_id": userId}
	update := bson.M{"$push": bson.M{"links": resp}}
	_, err = mdb.UpdateOne(ctx,
		query,
		update,
	)
	defer cancel()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(resp)
}

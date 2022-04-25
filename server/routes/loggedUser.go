package routes

import (
	"context"
	"log"
	"time"
	"url-shortener/controllers"
	"url-shortener/database"
	"url-shortener/helpers"
	"url-shortener/models"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func UserDetails(c *fiber.Ctx) error {
	userId := c.Params("user_id")

	if err := helpers.MatchuserTypeToUid(c, userId); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}

	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	mdb := database.OpenCollection(database.Client, "users")
	var user models.User
	err := mdb.FindOne(ctx, bson.M{"user_id": userId}).Decode(&user)
	defer cancel()
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(user)
}

func AddURL(c *fiber.Ctx) error {
	body := new(models.Request)

	userId := c.Params("user_id")

	if err := helpers.MatchuserTypeToUid(c, userId); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "cannot parse JSON"})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()
	mdb := database.OpenCollection(database.Client, "users")

	var x models.User
	if err := mdb.FindOne(ctx, bson.M{"user_id": userId}).Decode(&x); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	body.Addedby = userId
	body.User = *x.First_name + " " + *x.Last_Name

	msg, resp, err := controllers.ShortTheURL(*body)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": msg})
	}

	// mdb := database.OpenCollection(database.Client, "users")
	// userId := c.Locals("uid")

	query := bson.M{"user_id": userId}
	update := bson.M{"$push": bson.M{"links": bson.M{
		"url_id": resp.URL_ID,
		"url":    resp.URL,
		"short":  resp.Short,
		"expiry": resp.Expiry,
	}}}
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

func DeleteURL(c *fiber.Ctx) error {
	urlId := c.Params("url_id")
	userId := c.Params("user_id")
	if err := helpers.MatchuserTypeToUid(c, userId); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}
	msg, resp, err := controllers.DelShorten(urlId)

	// if err != nil {
	// 	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err, "msg": msg})
	// }
	// if resp <= 0 {
	// 	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Document Not Found"})
	// }

	msg, resp, err = controllers.DelFromUSer(urlId, userId)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	if resp <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Document Not Found"})
	}

	// fmt.Println(msg, resp, err)

	return c.Status(fiber.StatusOK).JSON(msg)

}

func UpdateProfile(c *fiber.Ctx) error {
	userId := c.Params("user_id")
	var user models.UpdateUser

	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "cannot parse JSON in login"})
	}

	if err := helpers.MatchuserTypeToUid(c, userId); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}
	*user.User_type = "USER"
	msg, resp, err := controllers.UpdateUser(userId, user)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error(), "msg": msg})
	}
	if resp <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Document Not Found"})
	}

	// fmt.Println(msg, resp, err)

	return c.Status(fiber.StatusOK).JSON(msg)
}

func UserLinks(c *fiber.Ctx) error {
	userId := c.Params("user_id")

	if err := helpers.MatchuserTypeToUid(c, userId); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}

	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	mdb := database.OpenCollection(database.Client, "shorten-urls")
	var links []primitive.M

	cursor, err := mdb.Find(ctx, bson.M{"addedby": userId})
	defer cancel()
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": err.Error()})
	}

	for cursor.Next(ctx) {
		var episode bson.M
		if err = cursor.Decode(&episode); err != nil {
			log.Fatal(err)
		}
		links = append(links, episode)
	}

	// fmt.Println(links)

	return c.Status(fiber.StatusOK).JSON(links)
}

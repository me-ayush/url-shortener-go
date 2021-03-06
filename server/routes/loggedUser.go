package routes

import (
	"context"
	"errors"
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

	// query := bson.M{"user_id": userId}
	// update := bson.M{"$push": bson.M{"links": bson.M{
	// 	"url_id": resp.URL_ID,
	// 	"url":    resp.URL,
	// 	"short":  resp.Short,
	// 	"expiry": resp.Expiry,
	// }}}
	// _, err = mdb.UpdateOne(ctx,
	// 	query,
	// 	update,
	// )

	// defer cancel()
	// if err != nil {
	// 	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	// }

	return c.Status(fiber.StatusOK).JSON(resp)
}

func DeleteURL(c *fiber.Ctx) error {
	urlId := c.Params("url_id")
	userId := c.Params("user_id")
	if err := helpers.MatchuserTypeToUid(c, userId); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}
	err := controllers.MatchURLParent(userId, urlId)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	msg, resp, err := controllers.DelShorten(urlId)

	// if err != nil {
	// 	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err, "msg": msg})
	// }
	// if resp <= 0 {
	// 	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Document Not Found"})
	// }

	// msg, resp, err = controllers.DelFromUSer(urlId, userId)

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
	x := "USER"
	user.User_type = &x
	user.Is_activated = 1
	msg, resp, err := controllers.UpdateUser(userId, user)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error(), "msg": msg})
	}
	if resp <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Document Not Found"})
	}

	return c.Status(fiber.StatusOK).JSON(msg)
}

func UserLinks(c *fiber.Ctx) error {
	userId := c.Params("user_id")

	if err := helpers.MatchuserTypeToUid(c, userId); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}

	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	mdb := database.OpenCollection(database.Client, "shorten-urls")
	// var links []primitive.M

	type x struct {
		ID             primitive.ObjectID `bson:"_id" json:"id"`
		URL_ID         string
		URL            string
		Short          string
		Addedby        string
		User           string
		Clicks         string
		Expiry         time.Time
		ExpiryAt       string
		ActivationTime time.Time
	}

	var links []models.User_Url_See_All_Response

	cursor, err := mdb.Find(ctx, bson.M{"addedby": userId})
	defer cancel()
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": err.Error()})
	}

	for cursor.Next(ctx) {
		var episode x
		var y models.User_Url_See_All_Response
		if err = cursor.Decode(&episode); err != nil {
			log.Fatal(err)
		}
		y.URL_ID = episode.ID.Hex()
		y.URL = episode.URL
		y.Short = episode.Short
		y.Clicks = episode.Clicks
		y.ExpiryAt = episode.Expiry.Format(time.ANSIC)
		y.ActivationTime = episode.ActivationTime.Format(time.ANSIC)

		links = append(links, y)
	}

	return c.Status(fiber.StatusOK).JSON(links)
}

func UpdateUser(c *fiber.Ctx) error {
	userId := c.Get("user_id")

	if err := helpers.MatchuserTypeToUid(c, userId); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	updateType := c.Get("update_type")

	err := errors.New("")
	if updateType == "password" {
		err = changePassUser(c)
	}
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON("Passoword Changed")
}

func changePassUser(c *fiber.Ctx) error {
	userId := c.Get("user_id")

	if err := helpers.MatchuserTypeToUid(c, userId); err != nil {
		return err
	}

	user_body := new(models.SelfUpdateUser)

	if err := c.BodyParser(&user_body); err != nil {
		return errors.New("cannot parse json")
	}

	err := controllers.ChangeUserPass(userId, *user_body)

	if err != nil {
		return err
	}
	return nil
}

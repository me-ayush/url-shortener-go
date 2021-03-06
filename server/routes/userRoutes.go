package routes

import (
	"context"
	"fmt"
	"os"
	"time"
	"url-shortener/controllers"
	"url-shortener/database"
	"url-shortener/helpers"
	"url-shortener/mailer"
	"url-shortener/models"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func Login(c *fiber.Ctx) error {
	var user models.User
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "cannot parse JSON in login"})
	}
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	mdb := database.OpenCollection(database.Client, "users")

	var foundUser models.User
	err := mdb.FindOne(ctx, bson.M{"email": user.Email}).Decode(&foundUser)
	defer cancel()
	if foundUser.Email == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "user not found"})
	}
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "email is inncorrect"})
	}

	if foundUser.Is_activated == 0 {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Account Is Not Activated"})
	}

	passwordIsValid, msg := helpers.VerifyPassword(*user.Password, *foundUser.Password)
	if !passwordIsValid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": msg})
	}

	token, refreshToken, _ := helpers.GenrateAllTokens(*foundUser.Email, *foundUser.First_name, *foundUser.Last_Name, *foundUser.User_type, *&foundUser.User_id)
	helpers.UpdateAllTokens(token, refreshToken, *&foundUser.User_id)
	err = mdb.FindOne(ctx, bson.M{"user_id": foundUser.User_id}).Decode(&foundUser)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})

	}
	return c.Status(fiber.StatusOK).JSON(foundUser)
}

func Signup(c *fiber.Ctx) error {
	var user models.User
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "cannot parse JSON in login"})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	mdb := database.OpenCollection(database.Client, "users")

	count, err := mdb.CountDocuments(ctx, bson.M{"email": user.Email})
	defer cancel()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "error during check email"})
	}
	if count > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "email already exists"})
	}

	otp := mailer.GetAuthString(200, fmt.Sprintf(*user.Email))
	verificationLink := fmt.Sprintf(os.Getenv("HOST") + "auth/activate/" + otp)
	err = mailer.Send_Verification_Mail(*user.First_name+" "+*user.Last_Name, *user.Email, "Account Verification", verificationLink)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	hashPass := helpers.HashPassword(*user.Password)
	user.Pass = *user.Password
	user.Password = &hashPass

	user.Created_at, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
	user.Updated_at, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
	user.ID = primitive.NewObjectID()
	user.User_id = user.ID.Hex()
	user.Activation_token = otp
	user.Is_activated = 0
	token, refreshToken, _ := helpers.GenrateAllTokens(*user.Email, *user.First_name, *user.Last_Name, *user.User_type, *&user.User_id)
	user.Token = &token
	user.Refresh_token = &refreshToken
	// var x models.Response
	// user.Links = []models.Response{}

	result, err := mdb.InsertOne(ctx, user)
	if err != nil {
		msg := fmt.Sprintf("User not created")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": msg})
	}
	defer cancel()

	// mdb.update(ctx, bson.M{"user_id":result.user_id}, { $set : {'myArray': [] }} , {multi:true} )

	return c.Status(fiber.StatusOK).JSON(result)
}

func Contact(c *fiber.Ctx) error {

	var message models.Msg
	if err := c.BodyParser(&message); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "cannot parse JSON in login"})
	}
	msg, err := controllers.StoreMessage(message)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": msg})
	}

	return c.Status(fiber.StatusOK).JSON(msg)
}

func ActivateAccountRoute(c *fiber.Ctx) error {
	queryValue := c.Params("token")

	err := controllers.ActivateAccount(queryValue)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(queryValue)
}

func SendNewActivationCodeRoute(c *fiber.Ctx) error {

	email := c.Params("email")
	err := controllers.SendNewActivationCode(email)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON("Email Sent")
}

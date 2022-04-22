package controllers

import (
	"context"
	"errors"
	"fmt"
	"time"
	"url-shortener/database"
	"url-shortener/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetAllUsers() ([]primitive.M, string) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	mdb := database.OpenCollection(database.Client, "users")
	result, err := mdb.Find(ctx, bson.D{})
	defer cancel()
	var allUsers []primitive.M

	if err != nil {
		return allUsers, fmt.Sprint(err.Error())
	}

	for result.Next(ctx) {
		var ep bson.M
		if err = result.Decode(&ep); err != nil {
			return allUsers, fmt.Sprint(err)
		}
		allUsers = append(allUsers, ep)
	}
	return allUsers, "ok"
}

func GetAllLinks() ([]primitive.M, string) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	mdb := database.OpenCollection(database.Client, "shorten-urls")
	result, err := mdb.Find(ctx, bson.D{})
	defer cancel()
	var allUsers []primitive.M

	if err != nil {
		return allUsers, fmt.Sprint(err.Error())
	}

	for result.Next(ctx) {
		var ep bson.M
		if err = result.Decode(&ep); err != nil {
			return allUsers, fmt.Sprint(err)
		}
		allUsers = append(allUsers, ep)
	}
	return allUsers, "ok"
}

func GetUserDetails(userid string) (models.User, string) {

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	mdb := database.OpenCollection(database.Client, "users")

	var user models.User
	err := mdb.FindOne(ctx, bson.M{"user_id": userid}).Decode(&user)
	defer cancel()

	if err != nil {
		return user, fmt.Sprint(err.Error())
	}

	return user, ""
}

func GetAllMessages() ([]primitive.M, string) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	mdb := database.OpenCollection(database.Client, "message")

	result, err := mdb.Find(ctx, bson.D{})
	defer cancel()

	var allMsg []primitive.M

	if err != nil {
		return allMsg, fmt.Sprint(err.Error())
	}

	for result.Next(ctx) {
		var x bson.M
		if err := result.Decode(&x); err != nil {
			return allMsg, fmt.Sprint(err)
		}
		allMsg = append(allMsg, x)
	}

	return allMsg, ""
}

func DelMessage(urlId string) (string, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	mdb := database.OpenCollection(database.Client, "message")

	id, _ := primitive.ObjectIDFromHex(urlId)

	_, err := mdb.DeleteOne(ctx, bson.M{"_id": id})
	defer cancel()
	if err != nil {
		return "Cannot Deleted URL", err
	}

	return "Message Successfully Deleted", nil
}

func DelLink(urlId string) (string, error) {

	// urlId := c.Params("url_id")
	id, _ := primitive.ObjectIDFromHex(urlId)

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	mdb := database.OpenCollection(database.Client, "shorten-urls")

	var userID models.Response

	_ = mdb.FindOne(ctx, bson.M{"_id": id}).Decode(&userID)
	defer cancel()

	// fmt.Println(userID)

	// return "no", nil

	msg, resp, err := DelShorten(urlId)

	if err != nil {
		// return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err, "msg": msg})
		return "no", err
	}
	if resp <= 0 {
		return "no", errors.New("Short Not Found")
	}

	// fmt.Println(userID.Addedby)
	msg, resp, err = DelFromUSer(urlId, userID.Addedby)

	if err != nil {
		return "no", err
	}

	if resp <= 0 {
		return "no", errors.New("Short Not Found In User")
	}

	return msg, nil
}

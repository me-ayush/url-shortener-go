package controllers

import (
	"context"
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

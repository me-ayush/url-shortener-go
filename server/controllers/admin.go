package controllers

import (
	"context"
	"fmt"
	"time"
	"url-shortener/database"

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

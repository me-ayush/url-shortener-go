package controllers

import (
	"context"
	"time"
	"url-shortener/database"
	"url-shortener/helpers"
	"url-shortener/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func UpdateUser(userId string, user models.UpdateUser) (string, int64, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	mdb := database.OpenCollection(database.Client, "users")

	id, _ := primitive.ObjectIDFromHex(userId)

	updatedTime := time.Now()
	user.Updated_at = updatedTime

	hashPass := helpers.HashPassword(*user.Password)
	user.Pass = *user.Password
	user.Password = &hashPass

	result, err := mdb.UpdateOne(ctx,
		bson.M{"_id": id},
		bson.M{"$set": user},
	)
	defer cancel()

	if err != nil {
		return "User Not Found", 0, err
	}

	return "User Updated", result.ModifiedCount, nil
}

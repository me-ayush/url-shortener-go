package controllers

import (
	"context"
	"errors"
	"time"
	"url-shortener/database"
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

	// hashPass := helpers.HashPassword(*user.Password)
	// user.Pass = *user.Password
	// user.Password = &hashPass

	// var userFound bson.M
	type x struct {
		Email   string `bson:"email"`
		User_id string `bson:"user_id"`
	}
	var userFound x
	_ = mdb.FindOne(ctx, bson.M{"email": user.Email}).Decode(&userFound)
	defer cancel()
	// if err != nil {
	// 	return "Email Already Exists", 0, err
	// }

	// fmt.Println(userFound.Email, userFound.User_id)
	// fmt.Println(*user.Email, userId)
	// fmt.Println(userFound.User_id != userId)
	if userId != userFound.User_id && userFound.Email == *user.Email {
		return "Email Already Exists", 0, errors.New("email already exists")
	}

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

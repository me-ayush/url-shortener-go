package controllers

import (
	"context"
	"errors"
	"time"
	"url-shortener/database"
	"url-shortener/helpers"
	"url-shortener/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type tempUser struct {
	Email   string `bson:"email"`
	User_id string `bson:"user_id"`
}

func UpdateUser(userId string, user models.UpdateUser) (string, int64, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	mdb := database.OpenCollection(database.Client, "users")
	id, _ := primitive.ObjectIDFromHex(userId)

	updatedTime := time.Now()
	user.Updated_at = updatedTime

	var userFound tempUser
	_ = mdb.FindOne(ctx, bson.M{"email": user.Email}).Decode(&userFound)
	defer cancel()

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

func ChangeUserPass(userId string, user_body models.SelfUpdateUser) error {

	if userId != user_body.User_id {
		return errors.New("user id do not match")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	mdb := database.OpenCollection(database.Client, "users")
	id, _ := primitive.ObjectIDFromHex(userId)

	var userFound models.User
	_ = mdb.FindOne(ctx, bson.M{"_id": id}).Decode(&userFound)
	defer cancel()

	if userFound.Password == nil || user_body.Old_pass == nil {
		return errors.New("something went wrong")
	}

	passwordIsValid, msg := helpers.VerifyPassword(*user_body.Old_pass, *userFound.Password)
	if !passwordIsValid {
		return errors.New(msg)
	}

	userFound.Updated_at = time.Now()
	hashPass := helpers.HashPassword(*user_body.New_pass)
	userFound.Pass = *user_body.New_pass
	userFound.Password = &hashPass

	_, err := mdb.UpdateOne(ctx,
		bson.M{"_id": id},
		bson.M{"$set": userFound},
	)
	defer cancel()

	if err != nil {
		return err
	}

	return nil
}

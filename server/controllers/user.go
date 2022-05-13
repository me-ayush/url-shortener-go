package controllers

import (
	"context"
	"encoding/base64"
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

func ActivateAccount(token string) error {

	oriToken := token

	if len(token) < 200 {
		return errors.New("activation token not valid")
	}

	part1 := token[:101]
	token = token[100:]
	reverse := reverseString(token)
	part2 := reverse[:101]
	mail := reverseString(reverse[100:])
	part2 = reverseString(part2)

	token = part1 + part2
	mailDecoded, err := base64Decode([]byte(mail))
	mail = string(mailDecoded)
	if err != nil {
		return err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	mdb := database.OpenCollection(database.Client, "users")
	var foundUser models.User
	err = mdb.FindOne(ctx, bson.M{"email": mail}).Decode(&foundUser)
	defer cancel()
	if err != nil {
		return err
	}

	if foundUser.Is_activated != 0 {
		return errors.New("user already activated")
	}

	if foundUser.Activation_token != oriToken {
		return errors.New("activation token not valid")
	}
	foundUser.Activation_token = ""
	foundUser.Is_activated = 1

	res, err := mdb.UpdateOne(ctx, bson.M{"user_id": foundUser.User_id}, bson.D{{"$set", foundUser}})
	defer cancel()

	if err != nil {
		return err
	}
	if res.ModifiedCount <= 0 {
		return errors.New("account not activated")
	}

	return nil
}

func reverseString(str string) string {
	byte_str := []rune(str)
	for i, j := 0, len(byte_str)-1; i < j; i, j = i+1, j-1 {
		byte_str[i], byte_str[j] = byte_str[j], byte_str[i]
	}
	return string(byte_str)
}

func base64Decode(src []byte) ([]byte, error) {
	return base64.StdEncoding.DecodeString(string(src))
}

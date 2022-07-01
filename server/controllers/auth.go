package controllers

import (
	"context"
	"encoding/base64"
	"errors"
	"fmt"
	"os"
	"time"
	"url-shortener/database"
	"url-shortener/mailer"
	"url-shortener/models"

	"go.mongodb.org/mongo-driver/bson"
)

func SendNewActivationCode(email string) error {

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	mdb := database.OpenCollection(database.Client, "users")

	var user models.User
	_ = mdb.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	defer cancel()

	if user.Email == nil {
		return errors.New("email not found")
	}
	if user.Is_activated != 0 {
		return errors.New("user already activated")
	}

	otp := mailer.GetAuthString(200, fmt.Sprintf(*user.Email))
	verificationLink := fmt.Sprintf(os.Getenv("HOST") + "auth/activate/" + otp)
	err := mailer.Send_Verification_Mail(*user.First_name+" "+*user.Last_Name, *user.Email, "Account Verification", verificationLink)

	if err != nil {
		return err
	}

	user.Activation_token = otp
	_, err = mdb.UpdateOne(ctx, bson.M{"user_id": user.User_id}, bson.D{{"$set", user}})
	defer cancel()

	if err != nil {
		return err
	}

	return nil
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

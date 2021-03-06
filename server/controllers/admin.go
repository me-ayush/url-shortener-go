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

func GetAllLinks() ([]models.Admin_Url_See_All_Response, string) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	mdb := database.OpenCollection(database.Client, "shorten-urls")
	result, err := mdb.Find(ctx, bson.D{})
	defer cancel()
	type x struct {
		ID             primitive.ObjectID `bson:"_id" json:"id"`
		URL_ID         string
		URL            string
		Short          string
		User           string
		Clicks         string
		Expiry         time.Time
		ActivationTime time.Time
	}
	var allLinks []models.Admin_Url_See_All_Response

	if err != nil {
		return allLinks, fmt.Sprint(err.Error())
	}

	for result.Next(ctx) {
		var ep x
		var y models.Admin_Url_See_All_Response
		if err = result.Decode(&ep); err != nil {
			return allLinks, fmt.Sprint(err)
		}
		y.URL_ID = ep.ID.Hex()
		y.User = ep.User
		y.URL = ep.URL
		y.Short = ep.Short
		y.Clicks = ep.Clicks
		y.ExpiryAt = ep.Expiry.Format(time.ANSIC)
		y.ActivationTime = ep.ActivationTime.Format(time.ANSIC)

		allLinks = append(allLinks, y)
	}
	return allLinks, "ok"
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
	id, _ := primitive.ObjectIDFromHex(urlId)

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	mdb := database.OpenCollection(database.Client, "shorten-urls")

	var userID models.Response

	_ = mdb.FindOne(ctx, bson.M{"_id": id}).Decode(&userID)
	defer cancel()

	msg, resp, err := DelShorten(urlId)
	if err != nil {
		return "no", err
	}
	if resp <= 0 {
		return "no", errors.New("Short Not Found")
	}

	// msg, resp, err = DelFromUSer(urlId, userID.Addedby)
	// if err != nil {
	// 	return "no", err
	// }
	// if resp <= 0 {
	// 	return "no", errors.New("Short Not Found In User")
	// }
	return msg, nil
}

func AdminUpdateUser(userId string, user models.UpdateUser) (string, int16, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	mdb := database.OpenCollection(database.Client, "users")

	id, _ := primitive.ObjectIDFromHex(userId)

	updatedTime := time.Now()
	user.Updated_at = updatedTime

	type x struct {
		Email   string `bson:"email"`
		User_id string `bson:"user_id"`
	}
	var userFound x
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

	return "User Updated Successfully", int16(result.ModifiedCount), nil
}

func AdminDelUser(userID string) (string, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	mdb := database.OpenCollection(database.Client, "users")

	id, _ := primitive.ObjectIDFromHex(userID)

	res, err := mdb.DeleteOne(ctx, bson.M{"_id": id})
	defer cancel()
	if err != nil {
		return "Not able to delete the User", err
	}

	if res.DeletedCount <= 0 {
		return "Not able to delete the User", nil
	}

	return "User Deleted", nil
}

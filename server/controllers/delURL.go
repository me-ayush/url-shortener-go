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

func MatchURLParent(userid string, urlId string) error {
	mdb := database.OpenCollection(database.Client, "shorten-urls")
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)

	var url models.Response
	id, _ := primitive.ObjectIDFromHex(urlId)

	_ = mdb.FindOne(ctx, bson.M{"_id": id}).Decode(&url)
	defer cancel()

	if url.Addedby != userid {
		return errors.New("user not valid")
	}

	return nil
}

func DelShorten(urlId string) (string, int64, error) {

	mdb := database.OpenCollection(database.Client, "shorten-urls")
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)

	id, _ := primitive.ObjectIDFromHex(urlId)

	res, err := mdb.DeleteOne(ctx, bson.M{"_id": id})
	defer cancel()
	if err != nil {
		return "Cannot Deleted URL", 0, err
	}

	return "sucessfully deleted url", res.DeletedCount, nil
}

// func DelFromUSer(urlId string, userId string) (string, int64, error) {

// 	mdb := database.OpenCollection(database.Client, "users")
// 	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)

// 	id, _ := primitive.ObjectIDFromHex(userId)

// 	result, err := mdb.UpdateOne(ctx,
// 		bson.M{"_id": id},
// 		bson.M{"$pull": bson.M{"links": bson.M{"url_id": urlId}}},
// 	)
// 	defer cancel()

// 	if err != nil {
// 		return "URL Not Found", 0, err
// 	}

// 	return "successfully deleted from user", result.ModifiedCount, nil

// }

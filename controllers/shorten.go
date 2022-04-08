package controllers

import (
	"context"
	"errors"
	"fmt"
	"time"
	"url-shortener/database"
	"url-shortener/helpers"
	"url-shortener/models"

	"github.com/asaskevich/govalidator"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func ShortTheURL(body models.Request) (string, models.Response, error) {

	// check if the input is an actual URL
	resp := models.Response{
		URL:             "",
		Short:           "",
		Expiry:          0,
		XrateReaminimg:  0,
		XrateLimitReset: 0,
	}
	err := *new(error)
	if !govalidator.IsURL(body.URL) {
		err = errors.New("invaild url")
		msg := "Invalid URL"
		return msg, resp, err
	}

	// check for domain error
	if !helpers.RemoveDomainError(body.URL) {
		err = errors.New("domain error")
		msg := "Domain Not Found"
		return msg, resp, err
	}

	// enforce https, SSL
	body.URL = helpers.EnforceHTTP(body.URL)

	var id string

	// fmt.Println(body)
	if body.Short == "" {
		id = uuid.New().String()[:6]
		body.Short = id
	} else {
		id = body.Short
	}

	mdb := database.OpenCollection(database.Client, "shorten-urls")
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)

	count, err := mdb.CountDocuments(ctx, bson.M{"short": id})
	defer cancel()
	if err != nil {
		msg := "cannot connect to datavbase"
		return msg, resp, err
	}
	if count > 0 {
		err = errors.New("custom short is alreadyy in use")
		msg := "Short already in use"
		return msg, resp, err
	}

	if body.Expiry == 0 {
		body.Expiry = 24
	}

	body.Expiry = body.Expiry * 3600 * time.Second

	res, err := mdb.InsertOne(ctx, body)
	defer cancel()
	if err != nil {
		msg := "cannot connect to datavbase"
		return msg, resp, err
	}

	resp = models.Response{
		URL:             body.URL,
		Short:           body.Short,
		Expiry:          body.Expiry,
		XrateReaminimg:  10,
		XrateLimitReset: 30,
	}
	// resp.URL_ID = primitive.NewObjectID().Hex()
	// x := fmt.Sprint(res.InsertedID)
	x, _ := res.InsertedID.(primitive.ObjectID)
	resp.URL_ID = fmt.Sprint(x.Hex())

	return "ok", resp, nil
}

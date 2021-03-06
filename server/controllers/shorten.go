package controllers

import (
	"context"
	"errors"
	"strconv"
	"time"
	"url-shortener/database"
	"url-shortener/helpers"
	"url-shortener/models"

	"github.com/asaskevich/govalidator"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
)

func ShortTheURL(body models.Request) (string, models.User_Url_Add_Response, error) {

	resp := models.User_Url_Add_Response{
		URL:   "",
		Short: "",
	}
	err := *new(error)
	// check if the input is an actual URL
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

	// Create random 6 digit short
	var id string
	if body.Short == "" {
		id = uuid.New().String()[:6]
		body.Short = id
	} else {
		id = body.Short
	}

	// Database connection
	mdb := database.OpenCollection(database.Client, "shorten-urls")
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)

	// checking if short already exists or not
	count, err := mdb.CountDocuments(ctx, bson.M{"short": id})
	defer cancel()
	if err != nil {
		msg := "cannot connect to database"
		return msg, resp, err
	}
	if count > 0 {
		err = errors.New("custom short is alreadyy in use")
		msg := "Short already in use"
		return msg, resp, err
	}

	// adding expiry date
	if body.ExpiryDays < 0 {
		today := time.Now()
		body.Expiry = today.Add(2 * 24 * time.Hour)
	} else {
		// today := time.Now()
		// body.Expiry = today.Add(time.Duration(body.ExpiryDays*24) * time.Hour)
		body.Expiry = convert_time_to_ist(body.Expiry)
	}

	// adding activation time
	body.ActivationTime = convert_time_to_ist(body.ActivationTime)

	// body.Expiry = body.Expiry * 3600 * time.Second

	// Initializing clicks to 0
	body.Clicks = strconv.Itoa(0)

	// inserting data
	_, err = mdb.InsertOne(ctx, body)
	defer cancel()
	if err != nil {
		msg := "cannot connect to datavbase"
		return msg, resp, err
	}

	// creating response
	resp = models.User_Url_Add_Response{
		URL:            body.URL,
		Short:          body.Short,
		ExpiryAt:       body.Expiry.Format(time.ANSIC),
		ActivationTime: body.ActivationTime.Format(time.ANSIC),
	}

	// resp.URL_ID = primitive.NewObjectID().Hex()
	// x := fmt.Sprint(res.InsertedID)

	// x, _ := res.InsertedID.(primitive.ObjectID)
	// resp.URL_ID = fmt.Sprint(x.Hex())

	return "ok", resp, nil
}

func convert_time_to_ist(curr_time time.Time) time.Time {
	loc, _ := time.LoadLocation("Asia/Kolkata")
	dataTime := curr_time.In(loc)
	return dataTime
}

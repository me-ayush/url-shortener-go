package controllers

import (
	"context"
	"errors"
	"fmt"
	"time"
	"url-shortener/database"
	"url-shortener/models"
)

func StoreMessage(body models.Msg) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()
	mdb := database.OpenCollection(database.Client, "message")

	if body.Name == "" || body.Email == "" || body.Subject == "" || body.Message == "" {
		return "Fill All Fields", errors.New("fill all fields")
	}

	_, err := mdb.InsertOne(ctx, body)

	if err != nil {
		return fmt.Sprint(err.Error()), err
	}

	return "Message Recieved", nil
}

package routes

import (
	"fmt"
	"url-shortener/mailer"

	"github.com/gofiber/fiber/v2"
)

func Test(c *fiber.Ctx) error {

	sender := "test@url-shortener.com"
	to := []string{
		fmt.Sprintf("ayushkushwaha321@gmail.com"),
	}
	subject := "This is test"
	body := "this is body"

	request := mailer.Mail{
		Sender:  sender,
		From:    sender,
		To:      to,
		Subject: subject,
		Body:    body,
	}

	err := mailer.SendMail("Ayush Ji", "ayushkushwaha321@gmail.com", "Kushwaha", "subject", request)

	return c.Status(fiber.StatusOK).JSON(err)
}

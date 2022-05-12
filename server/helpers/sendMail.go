package helpers

import (
	"fmt"
	"net/smtp"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Mail struct {
	Sender  string
	To      []string
	Subject string
	Body    string
}

func SendMail(send_to string, subject string, body string) error {

	err := godotenv.Load()

	from := os.Getenv("USER_NAME")
	password := os.Getenv("PASS_WORD")

	to := []string{
		fmt.Sprintf(send_to),
	}

	smtpHost := "smtp.gmail.com"
	smtpPort := "587"

	sender := "admin@url-shortener.com"

	// body := `<p>An old <b>falcon</b> in the sky.</p>`
	request := Mail{
		Sender:  sender,
		To:      to,
		Subject: subject,
		Body:    body,
	}
	message := buildMessage(request)

	// Authentication.
	auth := smtp.PlainAuth("", from, password, smtpHost)

	// Sending email.
	err = smtp.SendMail(smtpHost+":"+smtpPort, auth, from, to, []byte(message))
	if err != nil {
		return err
	}
	return nil
}

func buildMessage(mail Mail) string {
	msg := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\r\n"
	msg += fmt.Sprintf("From: %s\r\n", mail.Sender)
	msg += fmt.Sprintf("To: %s\r\n", strings.Join(mail.To, ";"))
	msg += fmt.Sprintf("Subject: %s\r\n", mail.Subject)
	msg += fmt.Sprintf("\r\n%s\r\n", mail.Body)

	return msg
}

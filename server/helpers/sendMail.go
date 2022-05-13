package helpers

import (
	"bytes"
	"fmt"
	"html/template"
	"net/smtp"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Mail struct {
	Sender  string
	From    string
	To      []string
	Subject string
	Body    string
}

func SendMail(recieverName, send_to string, subject string, body string) error {

	err := godotenv.Load()

	username := os.Getenv("USER_NAME")
	password := os.Getenv("PASS_WORD")
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"
	auth := smtp.PlainAuth("", username, password, smtpHost)

	t, err := template.ParseFiles("templates/verification_email.html")
	if err != nil {
		return err
	}
	var bodyx bytes.Buffer
	t.Execute(&bodyx, struct {
		Name string
		URL  string
	}{
		Name: recieverName,
		URL:  body,
	})

	to := []string{
		fmt.Sprintf(send_to),
	}

	sender := "admin@url-shortener.com"
	request := Mail{
		Sender:  sender,
		From:    sender,
		To:      to,
		Subject: subject,
		Body:    bodyx.String(),
	}
	message := buildMessage(request)

	err = smtp.SendMail(smtpHost+":"+smtpPort, auth, sender, to, []byte(message))
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

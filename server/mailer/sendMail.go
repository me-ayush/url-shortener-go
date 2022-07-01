package mailer

import (
	"fmt"
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

func SendMail(recieverName string, send_to string, sent_by string, subject string, request Mail) error {

	_ = godotenv.Load()

	username := os.Getenv("USER_NAME")
	password := os.Getenv("PASS_WORD")
	smtpHost := os.Getenv("SMTP_SERVER")
	smtpPort := os.Getenv("SMTP_PORT")
	sender := "admin@url-shortener.com"

	auth := smtp.PlainAuth("", username, password, smtpHost)

	message := buildMessage(request, sent_by)
	to := []string{
		fmt.Sprintf(send_to),
	}

	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, sender, to, []byte(message))
	if err != nil {
		return err
	}
	return nil
}

func buildMessage(mail Mail, name string) string {
	msg := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\r\n"
	msg += fmt.Sprintf("From: %s %s\r\n", name, mail.From)
	msg += fmt.Sprintf("To: %s\r\n", strings.Join(mail.To, ";"))
	msg += fmt.Sprintf("Subject: %s\r\n", mail.Subject)
	msg += fmt.Sprintf("\r\n%s\r\n", mail.Body)

	return msg
}

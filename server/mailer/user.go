package mailer

import (
	"bytes"
	"fmt"
	"html/template"
)

func Send_Verification_Mail(recieverName, send_to string, subject string, body string) error {
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

	sender := "no-reply@url-shortener.com"
	from := "Account Activation"

	request := Mail{
		Sender:  sender,
		From:    sender,
		To:      to,
		Subject: subject,
		Body:    bodyx.String(),
	}

	return SendMail(recieverName, send_to, from, subject, request)
}

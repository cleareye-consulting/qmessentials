package utilities

import (
	"errors"
	"net/smtp"
	"os"

	"github.com/rs/zerolog/log"
	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

type EmailUtil struct{}

func (eu *EmailUtil) SendEmail(recipient string, subject string, body string) error {
	if os.Getenv("SMTP_HOST") != "" {
		return sendEmailWithSmtp(recipient, subject, body)
	}
	if os.Getenv("SENDGRID_API_KEY") != "" {
		return sendEmailWithSendGrid(recipient, subject, body)
	}
	return errors.New("unable to determine email method")
}

func sendEmailWithSmtp(recipient string, subject string, body string) error {
	emailUser := os.Getenv("SMTP_USER")
	emailPassword := os.Getenv("SMTP_PASSWORD")
	emailHost := os.Getenv("SMTP_HOST")
	emailServer := os.Getenv("SMTP_HOST")
	if emailUser == "" || emailPassword == "" || emailHost == "" || emailServer == "" {
		log.Warn().Msgf("Email settings not provided; email will not be sent. Body was %s", body)
	}
	auth := smtp.PlainAuth("", emailUser, emailPassword, emailHost)
	to := []string{recipient}
	bodyBytes := []byte(body)
	err := smtp.SendMail(emailServer, auth, emailUser, to, bodyBytes)
	return err
}

func sendEmailWithSendGrid(recipient string, subject string, body string) error {
	from := mail.NewEmail(os.Getenv("SENDGRID_SENDER_NAME"), os.Getenv("SENDGRID_SENDER_EMAIL"))
	to := mail.NewEmail(recipient, recipient)
	message := mail.NewSingleEmailPlainText(from, subject, to, body)
	client := sendgrid.NewSendClient(os.Getenv("SENDGRID_API_KEY"))
	_, err := client.Send(message)
	return err
}

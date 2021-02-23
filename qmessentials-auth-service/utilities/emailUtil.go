package utilities

import (
	"net/smtp"
	"os"
)

type EmailUtil struct{}

func (eu *EmailUtil) SendEmail(recipient string, subject string, body string) error {
	emailUser := os.Getenv("EMAIL_USER")
	emailPassword := os.Getenv("EMAIL_PASSWORD")
	emailHost := os.Getenv("EMAIL_HOST")
	emailServer := os.Getenv("EMAIL_SERVER")
	auth := smtp.PlainAuth("", emailUser, emailPassword, emailHost)
	to := []string{recipient}
	bodyBytes := []byte(body)
	err := smtp.SendMail(emailServer, auth, emailUser, to, bodyBytes)
	return err
}

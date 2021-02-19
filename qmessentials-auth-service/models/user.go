package models

//User stores information about a user
type User struct {
	ID                       string
	GivenNames               []string
	Surnames                 []string
	Claims                   []Claim
	EmailAddress             string
	IsActive                 bool
	IsPasswordChangeRequired bool
	HashedPassword           string
}

package models

//User stores information about a user
type User struct {
	UserID                   string
	GivenNames               []string
	FamilyNames              []string
	Roles                    []string
	EmailAddress             string
	IsActive                 bool
	IsPasswordChangeRequired bool
	HashedPassword           string
}

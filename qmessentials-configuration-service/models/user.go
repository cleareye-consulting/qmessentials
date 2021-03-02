package models

//User stores information about a user
type User struct {
	UserID                   string      `pg:", pk"`
	GivenNames               []string    `pg:",array"`
	FamilyNames              []string    `pg:",array"`
	Claims                   []UserClaim `pg:"rel:has-many"`
	EmailAddress             string
	IsActive                 bool
	IsPasswordChangeRequired bool
	HashedPassword           string
}

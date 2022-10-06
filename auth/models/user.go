package models

//User stores information about a user
type User struct {
	UserID                   string   `bson:"userId" json:"userId"`
	GivenNames               []string `bson:"givenNames" json:"givenNames"`
	FamilyNames              []string `bson:"familyNames" json:"familyNames"`
	Roles                    []string `bson:"roles" json:"roles"`
	EmailAddress             string   `bson:"emailAddress" json:"emailAddress"`
	IsActive                 bool     `bson:"isActive" json:"isActive"`
	IsPasswordChangeRequired bool     `bson:"isPasswordChangeRequired" json:"isPasswordChangeRequired"`
	HashedPassword           string   `bson:"hashedPassword" json:"-"`
}

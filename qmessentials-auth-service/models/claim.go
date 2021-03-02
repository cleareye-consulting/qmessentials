package models

//Claim stores a claim type and value associated with a user
type UserClaim struct {
	UserID     string   `pg:", pk"`
	ClaimType  string   `pg:", pk"`
	ClaimValue []string `pg:",array"`
}

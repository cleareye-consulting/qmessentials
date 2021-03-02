package models

type PasswordChange struct {
	UserID      string
	OldPassword string
	NewPassword string
}

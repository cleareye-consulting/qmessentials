package utilities

import "golang.org/x/crypto/bcrypt"

type BcryptUtil struct{}

func (bu *BcryptUtil) Encrypt(password string) ([]byte, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.MinCost)
	return hash, err
}

func (bu *BcryptUtil) Compare(input string, stored string) (bool, error) {
	err := bcrypt.CompareHashAndPassword([]byte(stored), []byte(input))
	if err != nil {
		return false, err
	}
	return true, nil
}

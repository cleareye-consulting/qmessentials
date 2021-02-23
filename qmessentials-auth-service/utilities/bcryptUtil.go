package utilities

import (
	"math/rand"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
)

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

func (bu *BcryptUtil) GenerateRandomPassword() string {
	//generate a string with three parts, separated by a hyphen, where each part contains six uppercase or lowercase
	//letters and/or numbers
	rand.Seed(time.Now().UnixNano())
	lowercase := []rune("abcdefghijklmnopqrstuvwxyz")
	uppercase := []rune("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
	digits := []rune("0123456789")
	var charSets [][]rune
	charSets[0] = lowercase
	charSets[1] = uppercase
	charSets[2] = digits
	var parts [3]string
	for i := 0; i < 3; i++ {
		var b strings.Builder
		for j := 0; j < 6; j++ {
			charSetIndex := rand.Intn(2)
			charSet := charSets[charSetIndex]
			char := charSet[rand.Intn(len(charSet))]
			b.WriteRune(char)
		}
		parts[i] = b.String()
	}
	return strings.Join(parts[:], "-")
}

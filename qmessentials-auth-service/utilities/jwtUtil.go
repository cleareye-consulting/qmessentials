package utilities

import (
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
)

type JWTUtil struct{}

func (ju *JWTUtil) CreateToken(userID string) (string, error) {
	claims := jwt.MapClaims{}
	claims["iss"] = "qmessentials-auth-service"
	claims["sub"] = userID
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix()
	rawToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := rawToken.SignedString(os.Getenv("ACCESS_SECRET"))
	if err != nil {
		return "", err
	}
	return signedToken, nil
}

func (ju *JWTUtil) VerifyToken(encodedToken string) (string, error) {
	token, err := jwt.Parse(encodedToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("ACCESS_SECRET")), nil
	})
	if err != nil {
		return "", err
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return "", nil
	}
	userID, ok := claims["userID"].(string)
	if !ok {
		return "", errors.New("Unable to retrieve user ID from access token")
	}
	return userID, nil
}

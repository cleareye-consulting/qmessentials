package repositories

import (
	"errors"

	"github.com/cleareyeconsulting/qmessentials/auth/models"
	"github.com/go-pg/pg/v10"
)

type UserRepository struct{}

func (ur *UserRepository) GetUserByID(id string) (*models.User, error) {
	db := pg.Connect(&pg.Options{
		User:     "postgres",
		Database: "qmessentials-auth",
	})
	defer db.Close()
	user := models.User{
		ID: id,
	}
	err := db.Model(&user).WherePK().Select()
	return &user, err
}

func (ur *UserRepository) GetUserBySearch(name *string, email *string, isActive *bool) ([]*models.User, error) {
	return nil, errors.New("Not implemented")
}

func (ur *UserRepository) AddUser(user *models.User) (string, error) {
	return "", errors.New("Not implemented")
}

func (ur *UserRepository) UpdateUser(id string, user *models.User) error {
	return errors.New("Not implemented")
}

package repositories

import (
	"errors"
	"fmt"

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
		UserID: id,
	}
	err := db.Model(&user).WherePK().Select()
	return &user, err
}

func (ur *UserRepository) GetUsersBySearch(name *string, email *string, isActive *bool) (*[]models.User, error) {
	db := pg.Connect(&pg.Options{
		User:     "postgres",
		Database: "qmessentials-auth",
	})
	defer db.Close()
	var users []models.User
	query := db.Model(&users)
	if name != nil && *name != "" {
		query = query.Where("? = ANY (family_names) or ? = ANY (given_names)", *name, *name)
	}
	if email != nil && *email != "" {
		query = query.Where("email_address = ?", *email)
	}
	if isActive != nil {
		query = query.Where("is_active = ?", *isActive)
	}
	err := query.Select()
	return &users, err
}

func (ur *UserRepository) AddUser(user *models.User) (string, error) {
	db := pg.Connect(&pg.Options{
		User:     "postgres",
		Database: "qmessentials-auth",
	})
	defer db.Close()
	r, err := db.Model(user).Insert()
	if err != nil {
		return "", err
	}
	if r.RowsAffected() != 1 {
		return "", fmt.Errorf("Insert operation affected %v rows", r.RowsAffected())
	}
	return user.UserID, nil
}

func (ur *UserRepository) UpdateUser(id string, user *models.User) error {
	db := pg.Connect(&pg.Options{
		User:     "postgres",
		Database: "qmessentials-auth",
	})
	defer db.Close()
	if id != user.UserID {
		return errors.New("User ID on model doesn't match ID parameter")
	}
	r, err := db.Model(user).WherePK().Update()
	if err != nil {
		return err
	}
	if r.RowsAffected() != 1 {
		return fmt.Errorf("Update operation affected %v rows", r.RowsAffected())
	}
	return nil
}

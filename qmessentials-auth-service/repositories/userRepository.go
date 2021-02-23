package repositories

import (
	"errors"
	"fmt"

	"github.com/cleareyeconsulting/qmessentials/auth/models"
	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
)

type UserRepository struct{}

func (ur *UserRepository) GetUserByID(id string) (*models.User, error) {
	db := pg.Connect(&pg.Options{
		User:     "postgres",
		Database: "qmessentials-auth",
	})
	defer db.Close()
	err := createSchema(db)
	if err != nil {
		return nil, err
	}
	user := models.User{
		ID: id,
	}
	err = db.Model(&user).WherePK().Select()
	return &user, err
}

func (ur *UserRepository) GetUsersBySearch(name *string, email *string, isActive *bool) (*[]models.User, error) {
	db := pg.Connect(&pg.Options{
		User:     "postgres",
		Database: "qmessentials-auth",
	})
	defer db.Close()
	err := createSchema(db)
	if err != nil {
		return nil, err
	}
	var users []models.User
	query := db.Model(&users)
	if name != nil {
		query = query.Where("UserName = ?", *name)
	}
	if email != nil {
		query = query.Where("Email = ?", *email)
	}
	if isActive != nil {
		query = query.Where("IsActive = ?", *isActive)
	}
	err = query.Select()
	return &users, err
}

func (ur *UserRepository) AddUser(user *models.User) (string, error) {
	db := pg.Connect(&pg.Options{
		User:     "postgres",
		Database: "qmessentials-auth",
	})
	defer db.Close()
	err := createSchema(db)
	if err != nil {
		return "", err
	}
	r, err := db.Model(user).Insert()
	if err != nil {
		return "", err
	}
	if r.RowsAffected() != 1 {
		return "", fmt.Errorf("Insert operation affected %v rows", r.RowsAffected())
	}
	return user.ID, nil
}

func (ur *UserRepository) UpdateUser(id string, user *models.User) error {
	db := pg.Connect(&pg.Options{
		User:     "postgres",
		Database: "qmessentials-auth",
	})
	defer db.Close()
	err := createSchema(db)
	if err != nil {
		return err
	}
	if id != user.ID {
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

func createSchema(db *pg.DB) error {
	var user models.User
	err := db.Model(&user).CreateTable(&orm.CreateTableOptions{
		Temp: false,
	})
	if err != nil {
		return err
	}
	var claim models.Claim
	err = db.Model(&claim).CreateTable(&orm.CreateTableOptions{
		Temp: false,
	})
	if err != nil {
		return err
	}
	return nil
}

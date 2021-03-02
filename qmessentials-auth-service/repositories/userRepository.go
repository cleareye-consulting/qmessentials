package repositories

import (
	"errors"
	"fmt"
	"os"

	"github.com/cleareyeconsulting/qmessentials/auth/models"
	"github.com/go-pg/pg/v10"
)

type UserRepository struct{}

func (ur *UserRepository) GetUserByID(id string) (*models.User, error) {
	db := pg.Connect(&pg.Options{
		User:     os.Getenv("DATABASE_USER"),
		Database: os.Getenv("DATABASE_NAME"),
	})
	defer db.Close()
	user := models.User{
		UserID: id,
	}
	err := db.Model(&user).WherePK().Select()
	if err != nil {
		return nil, err
	}
	err = db.Model(&user.Claims).Where("user_id = ?", id).Select()
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (ur *UserRepository) GetUsersBySearch(name *string, email *string, isActive *bool) (*[]models.User, error) {
	db := pg.Connect(&pg.Options{
		User:     os.Getenv("DATABASE_USER"),
		Database: os.Getenv("DATABASE_NAME"),
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
	if err != nil {
		return nil, err
	}
	for i := 0; i < len(users); i++ {
		user := &users[i]
		err = db.Model(&user.Claims).Where("user_id = ?", user.UserID).Select()
		if err != nil {
			return nil, err
		}
	}
	return &users, nil
}

func (ur *UserRepository) AddUser(user *models.User) (string, error) {
	db := pg.Connect(&pg.Options{
		User:     os.Getenv("DATABASE_USER"),
		Database: os.Getenv("DATABASE_NAME"),
	})
	defer db.Close()
	for i := 0; i < len(user.Claims); i++ {
		user.Claims[i].UserID = user.UserID
	}
	tx, err := db.Begin()
	if err != nil {
		return "", err
	}
	r, err := tx.Model(user).Insert()
	if err != nil {
		tx.Rollback()
		return "", err
	}
	if r.RowsAffected() != 1 {
		tx.Rollback()
		return "", fmt.Errorf("Insert operation affected %v rows, expected 1", r.RowsAffected())
	}
	r, err = tx.Model(&user.Claims).Insert()
	if err != nil {
		tx.Rollback()
		return "", err
	}
	if r.RowsAffected() != len(user.Claims) {
		tx.Rollback()
		return "", fmt.Errorf("Insert operation affected %v rows, expected %v", r.RowsAffected(), len(user.Claims))
	}
	tx.Commit()
	return user.UserID, nil
}

func (ur *UserRepository) UpdateUser(id string, user *models.User) error {
	db := pg.Connect(&pg.Options{
		User:     os.Getenv("DATABASE_USER"),
		Database: os.Getenv("DATABASE_NAME"),
	})
	defer db.Close()
	if id != user.UserID {
		return errors.New("User ID on model doesn't match ID parameter")
	}
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	r, err := tx.Model(user).WherePK().Update()
	if err != nil {
		tx.Rollback()
		return err
	}
	if r.RowsAffected() != 1 {
		tx.Rollback()
		return fmt.Errorf("Update operation affected %v rows, expected 1", r.RowsAffected())
	}
	r, err = tx.Model(&user.Claims).Where("user_id = ?", id).Delete()
	if err != nil {
		tx.Rollback()
		return err
	}
	for i := 0; i < len(user.Claims); i++ {
		user.Claims[i].UserID = user.UserID
	}
	r, err = tx.Model(&user.Claims).Insert()
	if err != nil {
		tx.Rollback()
		return err
	}
	if r.RowsAffected() != len(user.Claims) {
		tx.Rollback()
		return fmt.Errorf("Insert operation affected %v rows, expected %v", r.RowsAffected(), len(user.Claims))
	}
	tx.Commit()
	return nil
}

func (ur *UserRepository) IsDefaultAdminNeeded() (bool, error) {
	db := pg.Connect(&pg.Options{
		User:     os.Getenv("DATABASE_USER"),
		Database: os.Getenv("DATABASE_NAME"),
	})
	defer db.Close()
	var claims []models.UserClaim
	err := db.Model(&claims).Where("claim_type = 'role' and 'Administrator' = ANY (claim_values)").Select()
	if err != nil {
		return false, err
	}
	for _, claim := range claims {
		user := models.User{UserID: claim.UserID}
		err = db.Model(&user).WherePK().Select()
		if err != nil {
			return false, err
		}
		if user.IsActive {
			return false, nil
		}
	}
	return true, nil
}

func (ur *UserRepository) CreateDefaultAdmin(hasher func(string) ([]byte, error)) error {
	hashedPasswordBytes, err := hasher(os.Getenv("DEFAULT_ADMIN_PASSWORD"))
	if err != nil {
		return errors.New("Unable to hash default password for default admin user")
	}
	defaultUser := os.Getenv("DEFAULT_ADMIN_USER")
	user := models.User{
		UserID:         defaultUser,
		HashedPassword: string(hashedPasswordBytes),
		GivenNames:     []string{"Default", "Admin"},
		FamilyNames:    []string{"User"},
		IsActive:       true,
		Claims: []models.UserClaim{
			{
				UserID:      defaultUser,
				ClaimType:   "role",
				ClaimValues: []string{"Administrator"},
			},
		},
	}
	db := pg.Connect(&pg.Options{
		User:     os.Getenv("DATABASE_USER"),
		Database: os.Getenv("DATABASE_NAME"),
	})
	defer db.Close()
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	r, err := tx.Model(&user).Insert()
	if err != nil {
		tx.Rollback()
		return err
	}
	if r.RowsAffected() != 1 {
		tx.Rollback()
		return errors.New("Error inserting default admin user")
	}
	r, err = tx.Model(&user.Claims[0]).Insert()
	if err != nil {
		tx.Rollback()
		return err
	}
	if r.RowsAffected() != 1 {
		tx.Rollback()
		return errors.New("Error inserting default admin user claim")
	}
	tx.Commit()
	return nil
}

package repositories

import (
	"errors"
	"fmt"
	"os"

	"github.com/cleareyeconsulting/qmessentials/auth/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type UserRepository struct{}

func (ur *UserRepository) GetUserByID(id string) (*models.User, error) {
	ctx, client, _, collection, err := getMongoDB("users")
	if err != nil {
		return nil, err
	}
	defer client.Disconnect(ctx)
	fr := collection.FindOne(ctx, bson.D{{Key: "userId", Value: id}})
	if fr.Err() == mongo.ErrNoDocuments {
		return nil, nil
	}
	var user models.User
	err = fr.Decode(&user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (ur *UserRepository) ListUsers() (*[]models.User, error) {
	ctx, client, _, collection, err := getMongoDB("users")
	if err != nil {
		return nil, err
	}
	defer client.Disconnect(ctx)
	csr, err := collection.Find(ctx, bson.D{})
	if err != nil {
		return nil, err
	}
	var users []models.User
	err = csr.All(ctx, &users)
	if err != nil {
		return nil, err
	}
	return &users, nil
}

func (ur *UserRepository) AddUser(user *models.User) error {
	ctx, client, _, collection, err := getMongoDB("users")
	if err != nil {
		return err
	}
	defer client.Disconnect(ctx)
	_, err = collection.InsertOne(ctx, user)
	return err
}

func (ur *UserRepository) UpdateUser(id string, user *models.User) error {
	ctx, client, _, collection, err := getMongoDB("users")
	if err != nil {
		return err
	}
	defer client.Disconnect(ctx)
	if id != user.UserID {
		return errors.New("user ID on model doesn't match ID parameter")
	}
	res, err := collection.ReplaceOne(ctx, bson.D{{Key: "userId", Value: id}}, user)
	if err != nil {
		return err
	}
	if res.ModifiedCount != 1 {
		return fmt.Errorf("expected to update 1 row, updated %v", res.ModifiedCount)
	}
	return nil
}

func (ur *UserRepository) IsDefaultAdminNeeded() (bool, error) {
	ctx, client, _, collection, err := getMongoDB("users")
	if err != nil {
		return false, err
	}
	defer client.Disconnect(ctx)
	count, err := collection.CountDocuments(ctx, bson.D{{
		Key: "roles", Value: bson.A{"Administrator"}},
		{Key: "isActive", Value: true}})
	if err != nil {
		return false, err
	}
	return count == 0, nil
}

func (ur *UserRepository) CreateDefaultAdmin(hasher func(string) ([]byte, error)) error {
	hashedPasswordBytes, err := hasher(os.Getenv("DEFAULT_ADMIN_PASSWORD"))
	if err != nil {
		return errors.New("unable to hash default password for default admin user")
	}
	defaultUser := os.Getenv("DEFAULT_ADMIN_USER")
	user := models.User{
		UserID:                   defaultUser,
		HashedPassword:           string(hashedPasswordBytes),
		GivenNames:               []string{"Default", "Admin"},
		FamilyNames:              []string{"User"},
		IsActive:                 true,
		IsPasswordChangeRequired: false,
		Roles:                    []string{"Administrator"},
	}
	ctx, client, _, collection, err := getMongoDB("users")
	if err != nil {
		return err
	}
	defer client.Disconnect(ctx)
	_, err = collection.InsertOne(ctx, &user)
	return err
}

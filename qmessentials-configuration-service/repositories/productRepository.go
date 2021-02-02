package repositories

import (
	"errors"

	"github.com/cleareyeconsulting/qmessentials/configuration/models"
)

type ProductRepository struct{}

func (pr *ProductRepository) List() (*models.Product, error) {
	return nil, errors.New("Not implemented")
}

func (pr *ProductRepository) Select(productID string) ([]*models.Product, error) {
	return nil, errors.New("Not implemented")
}

func (pr *ProductRepository) Add(product *models.Product) error {
	return errors.New("Not implemented")
}

func (pr *ProductRepository) Update(productID string, product *models.Product) error {
	return errors.New(("Not implemented"))
}

func (pr *ProductRepository) Delete(productID string) error {
	return errors.New("Not implemented")
}

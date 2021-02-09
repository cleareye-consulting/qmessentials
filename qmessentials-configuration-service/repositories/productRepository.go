package repositories

import (
	"errors"

	"github.com/cleareyeconsulting/qmessentials/configuration/models"
	"github.com/go-pg/pg/v10"
)

//ProductRepository represents the persistence layer for products
type ProductRepository struct{}

//List all products
func (pr *ProductRepository) List() (*[]models.Product, error) {
	db := pg.Connect(&pg.Options{
		User:     "postgres",
		Database: "qmessentials",
	})
	defer db.Close()
	var products []models.Product
	err := db.Model(&products).Select()
	return &products, err
}

//Select a product by ID
func (pr *ProductRepository) Select(productID string) (*models.Product, error) {
	db := pg.Connect(&pg.Options{
		User:     "postgres",
		Database: "qmessentials",
	})
	defer db.Close()
	product := models.Product{
		ProductID: productID,
	}
	err := db.Model(&product).WherePK().Select()
	return &product, err
}

//Add a product
func (pr *ProductRepository) Add(product *models.Product) error {
	db := pg.Connect(&pg.Options{
		User:     "postgres",
		Database: "qmessentials",
	})
	defer db.Close()
	_, err := db.Model(product).Insert()
	return err
}

//Update a product
func (pr *ProductRepository) Update(productID string, product *models.Product) error {
	if product.ProductID != productID {
		return errors.New("Product ID mismatch")
	}
	db := pg.Connect(&pg.Options{
		User:     "postgres",
		Database: "qmessentials",
	})
	defer db.Close()
	_, err := db.Model(product).WherePK().Update()
	return err
}

//Delete a product
func (pr *ProductRepository) Delete(productID string) error {
	db := pg.Connect(&pg.Options{
		User:     "postgres",
		Database: "qmessentials",
	})
	defer db.Close()
	product := models.Product{
		ProductID: productID,
	}
	_, err := db.Model(&product).WherePK().Delete()
	return err
}

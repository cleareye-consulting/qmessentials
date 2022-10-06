package repositories

import (
	"fmt"
	"time"

	"github.com/cleareyeconsulting/qmessentials/configuration/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

//ProductRepository represents the persistence layer for products
type ProductRepository struct{}

//List all products
func (pr *ProductRepository) List() (*[]models.Product, error) {
	ctx, client, _, collection, err := getMongoDB("products")
	if err != nil {
		return nil, err
	}
	defer client.Disconnect(ctx)
	csr, err := collection.Find(ctx, bson.D{})
	if err != nil {
		return nil, err
	}
	var products []models.Product
	err = csr.All(ctx, &products)
	if err != nil {
		return nil, err
	}
	return &products, nil
}

//Select a product by ID
func (pr *ProductRepository) Select(productID string) (*models.Product, error) {
	ctx, client, _, collection, err := getMongoDB("products")
	if err != nil {
		return nil, err
	}
	defer client.Disconnect(ctx)
	fr := collection.FindOne(ctx, bson.D{{Key: "productId", Value: productID}})
	if fr.Err() == mongo.ErrNoDocuments {
		return nil, nil
	}
	var product models.Product
	err = fr.Decode(&product)
	if err != nil {
		return nil, err
	}
	return &product, nil
}

//Add a product
func (pr *ProductRepository) Add(item *models.Product) error {
	ctx, client, _, collection, err := getMongoDB("products")
	if err != nil {
		return err
	}
	defer client.Disconnect(ctx)
	item.CreatedDate = time.Now()
	_, err = collection.InsertOne(ctx, item)
	return err
}

//Update a product
func (pr *ProductRepository) Update(productID string, item *models.Product) error {
	ctx, client, _, collection, err := getMongoDB("products")
	if err != nil {
		return err
	}
	defer client.Disconnect(ctx)
	res, err := collection.ReplaceOne(ctx, bson.D{{Key: "productId", Value: productID}}, item)
	if err != nil {
		return err
	}
	if res.ModifiedCount != 1 {
		return fmt.Errorf("expected to update 1, updated %v", res.ModifiedCount)
	}
	return nil
}

//Delete a product
func (pr *ProductRepository) Delete(productID string) error {
	ctx, client, _, collection, err := getMongoDB("products")
	if err != nil {
		return err
	}
	defer client.Disconnect(ctx)
	res, err := collection.DeleteOne(ctx, bson.D{{Key: "productId", Value: productID}})
	if err != nil {
		return err
	}
	if res.DeletedCount != 1 {
		return fmt.Errorf("expected to delete 1, deleted %v", res.DeletedCount)
	}
	return nil
}

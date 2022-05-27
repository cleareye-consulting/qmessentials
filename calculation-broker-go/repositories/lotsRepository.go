package repositories

import (
	"errors"
	"fmt"

	"github.com/cleareyeconsulting/qmessentials/calculationbroker/models"
	"go.mongodb.org/mongo-driver/bson"
)

type LotsRepository struct{}

func (lr *LotsRepository) ListAllLots() (*[]models.Lot, error) {
	ctx, client, _, collection, err := getMongoDB("lots")
	if err != nil {
		return nil, err
	}
	defer client.Disconnect(ctx)
	csr, err := collection.Find(ctx, bson.D{})
	if err != nil {
		return nil, err
	}
	var lots []models.Lot
	err = csr.All(ctx, &lots)
	return &lots, err
}

func (lr *LotsRepository) SelectLotByID(id interface{}) (*models.Lot, error) {
	ctx, client, _, collection, err := getMongoDB("lots")
	if err != nil {
		return nil, err
	}
	defer client.Disconnect(ctx)
	fr := collection.FindOne(ctx, bson.D{{Key: "lotId", Value: id}})
	if fr == nil {
		return nil, errors.New("invalid subscription ID")
	}
	var lot models.Lot
	err = fr.Decode(&lot)
	if err == nil {
		return nil, err
	}
	return &lot, nil
}

func (lr *LotsRepository) AddLot(item *models.Lot) (interface{}, error) {
	ctx, client, _, collection, err := getMongoDB("lots")
	if err != nil {
		return nil, err
	}
	defer client.Disconnect(ctx)
	res, err := collection.InsertOne(ctx, item)
	return res.InsertedID, err
}

func (lr *LotsRepository) DeleteLot(id interface{}) error {
	ctx, client, _, collection, err := getMongoDB("lots")
	if err != nil {
		return err
	}
	defer client.Disconnect(ctx)
	res, err := collection.DeleteOne(ctx, bson.D{{Key: "_id", Value: id}})
	if err != nil {
		return err
	}
	if res.DeletedCount != 1 {
		return fmt.Errorf("expected to delete 1, deleted %v", res.DeletedCount)
	}
	return nil
}

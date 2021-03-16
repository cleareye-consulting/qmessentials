package repositories

import (
	"errors"

	"github.com/cleareyeconsulting/qmessentials/calculationbroker/models"
	"go.mongodb.org/mongo-driver/bson"
)

type EnginesRepository struct{}

func (er *EnginesRepository) SelectEngineByID(id interface{}) (*models.Engine, error) {
	ctx, client, _, collection, err := getMongoDB("engines")
	if err != nil {
		return nil, err
	}
	defer client.Disconnect(ctx)
	fr := collection.FindOne(ctx, bson.D{{Key: "id", Value: id}})
	if fr == nil {
		return nil, errors.New("invalid engine ID")
	}
	var engine models.Engine
	err = fr.Decode(&engine)
	if err == nil {
		return nil, err
	}
	return &engine, nil
}

func (er *EnginesRepository) AddEngine(item *models.Engine) (interface{}, error) {
	ctx, client, _, collection, err := getMongoDB("engines")
	if err != nil {
		return 0, err
	}
	defer client.Disconnect(ctx)
	res, err := collection.InsertOne(ctx, &item)
	return res, err
}

func (er *EnginesRepository) DeleteAllEngines() error {
	ctx, client, _, collection, err := getMongoDB("engines")
	if err != nil {
		return err
	}
	defer client.Disconnect(ctx)
	_, err = collection.DeleteMany(ctx, bson.D{})
	return err
}

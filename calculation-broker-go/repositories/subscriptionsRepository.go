package repositories

import (
	"errors"
	"fmt"

	"github.com/cleareyeconsulting/qmessentials/calculationbroker/models"
	"go.mongodb.org/mongo-driver/bson"
)

type SubscriptionsRepo struct{}

func (sr *SubscriptionsRepo) SelectSubscriptionByID(id int) (*models.Subscription, error) {
	ctx, client, _, collection, err := getMongoDB("subscriptions")
	if err != nil {
		return nil, err
	}
	defer client.Disconnect(ctx)
	fr := collection.FindOne(ctx, bson.D{{Key: "subscriptionId", Value: id}})
	if fr == nil {
		return nil, errors.New("invalid subscription ID")
	}
	var subscription models.Subscription
	err = fr.Decode(&subscription)
	if err == nil {
		return nil, err
	}
	return &subscription, nil
}

func (sr *SubscriptionsRepo) ListSubscriptionsForLotID(lotID string) (*[]models.Subscription, error) {
	ctx, client, _, collection, err := getMongoDB("subscriptions")
	if err != nil {
		return nil, err
	}
	defer client.Disconnect(ctx)
	csr, err := collection.Find(ctx, bson.D{{Key: "lotId", Value: lotID}})
	if err == nil {
		return nil, err
	}
	var subscriptions []models.Subscription
	err = csr.All(ctx, &subscriptions)
	if err != nil {
		return nil, err
	}
	return &subscriptions, nil
}

func (sr *SubscriptionsRepo) CountSubscriptionsForLotID(lotID string) (int64, error) {
	ctx, client, _, collection, err := getMongoDB("subscriptions")
	if err != nil {
		return 0, err
	}
	defer client.Disconnect(ctx)
	count, err := collection.CountDocuments(ctx, bson.D{{Key: "lotId", Value: lotID}})
	if err != nil {
		return 0, err
	}
	return count, nil
}

func (sr *SubscriptionsRepo) AddSubscription(item *models.Subscription) (interface{}, error) {
	ctx, client, _, collection, err := getMongoDB("subscriptions")
	if err != nil {
		return 0, err
	}
	defer client.Disconnect(ctx)
	res, err := collection.InsertOne(ctx, &item)
	return res, err
}

func (sr *SubscriptionsRepo) DeleteSubscription(id interface{}) error {
	ctx, client, _, collection, err := getMongoDB("subscriptions")
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

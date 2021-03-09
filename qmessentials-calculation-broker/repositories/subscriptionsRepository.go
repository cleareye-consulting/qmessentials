package repositories

import "github.com/cleareyeconsulting/qmessentials/calculationbroker/models"

type SubscriptionsRepo struct{}

func (sr *SubscriptionsRepo) SelectSubscriptionByID(id int) (*models.Subscription, error) {
	panic("Not implemented")
}

func (sr *SubscriptionsRepo) ListSubscriptionsByLotID(lotID string) (*[]models.Subscription, error) {
	panic("Not implemented")
}

func (sr *SubscriptionsRepo) AddSubscription(item *models.Subscription) (int, error) {
	panic("Not implemented")
}

func (sr *SubscriptionsRepo) DeleteSubscription(subscriptionID int) error {
	panic("Not implemented")
}

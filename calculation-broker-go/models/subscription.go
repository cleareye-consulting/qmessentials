package models

import "time"

type Subscription struct {
	SubscriptionID int
	LotID          string
	CreatedDate    time.Time
	CreatedBy      string
	CallbackURL    string
}

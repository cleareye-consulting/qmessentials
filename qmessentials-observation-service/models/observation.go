package models

import (
	"time"

	"github.com/google/uuid"
)

type Observation struct {
	ObservationID      uuid.UUID `bson:"observationId" json:"observationId"`
	MetricID           int       `bson:"metricId" json:"metricId"`
	ItemID             string    `bson:"itemId" json:"itemId"`
	LotID              string    `bson:"lotId" json:"lotId"`
	ProductID          string    `bson:"productId" json:"productId"`
	LotSequenceNumber  int       `bson:"lotSequenceNumber" json:"lotSequenceNumber"`
	ItemSequenceNumber int       `bson:"itemSequenceNumber" json:"itemSequenceNumber"`
	Modifiers          []string  `bson:"modifiers" json:"modifiers"`
	Values             []float64 `bson:"values" json:"values"`
	CreatedDate        time.Time `bson:"createdDate" json:"createdDate"`
}

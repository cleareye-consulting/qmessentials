package models

import (
	"time"

	"github.com/google/uuid"
)

type Observation struct {
	ObservationID      uuid.UUID
	MetricID           int
	ItemID             string
	LotID              string
	ProductID          string
	LotSequenceNumber  int
	ItemSequenceNumber int
	Modifiers          []string
	Values             []float64
	CreatedDate        time.Time
}

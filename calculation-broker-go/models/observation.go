package models

import "time"

type Observation struct {
	ItemID             string
	LotID              string
	ProductID          string
	MetricID           string
	ItemSequenceNumber int
	LotSequenceNumber  int
	CreatedDate        time.Time
	Values             []float64
}

package models

type LotCalculations struct {
	LotID              string
	ProductID          string
	MetricCalculations []MetricCalculations
}

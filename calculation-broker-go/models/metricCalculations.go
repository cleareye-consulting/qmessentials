package models

type MetricCalculations struct {
	MetricID          string
	Count             int
	MinValue          float64
	MaxValue          float64
	Average           float64
	Sum               float64
	FirstQuartile     float64
	Median            float64
	ThirdQuartile     float64
	StandardDeviation float64
}

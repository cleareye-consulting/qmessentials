package repositories

import "github.com/cleareyeconsulting/qmessentials/calculationbroker/models"

type LotMetricCalculationsRepository struct{}

func (lmcr *LotMetricCalculationsRepository) ListLotMetricCalculationsByLotID(lotID string) (*[]models.LotMetricCalculation, error) {
	panic("Not implemented")
}

func (lmcr *LotMetricCalculationsRepository) AddLotMetricCalculations(item *[]models.LotMetricCalculation) error {
	panic("Not implemented")
}

func (lmcr *LotMetricCalculationsRepository) DeleteLotMetricCalculationsByLotID(lotID string) error {
	panic("Not implemented")
}

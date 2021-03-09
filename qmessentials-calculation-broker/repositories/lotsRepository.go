package repositories

import "github.com/cleareyeconsulting/qmessentials/calculationbroker/models"

type LotsRepository struct{}

func (lr *LotsRepository) ListAllLots() (*[]models.Lot, error) {
	panic("Not implemented")
}

func (lr *LotsRepository) SelectLotByID(id string) (*models.Lot, error) {
	panic("Not implemented")
}

func (lr *LotsRepository) AddLot(item *models.Lot) error {
	panic("Not implemented")
}

func (lr *LotsRepository) ReplaceLot(id string, item *models.Lot) error {
	panic("Not implemented")
}

func (lr *LotsRepository) DeleteLot(id string) error {
	panic("Not implemented")
}

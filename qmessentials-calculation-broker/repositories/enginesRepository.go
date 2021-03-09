package repositories

import "github.com/cleareyeconsulting/qmessentials/calculationbroker/models"

type EnginesRepository struct{}

func (er *EnginesRepository) SelectEngineByID(id int) (*models.Engine, error) {
	panic("Not implemented")
}

func (er *EnginesRepository) ListAllEngines() (*[]models.Engine, error) {
	panic("Not implemented")
}

func (er *EnginesRepository) AddEngine(item *models.Engine) (int, error) {
	panic("Not implemented")
}

func (er *EnginesRepository) DeleteEngine(id int) error {
	panic("Not implemented")
}

func (er *EnginesRepository) DeleteAllEngines() error {
	panic("Not implemented")
}

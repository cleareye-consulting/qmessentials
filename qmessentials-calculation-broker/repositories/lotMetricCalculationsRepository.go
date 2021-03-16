package repositories

import (
	"fmt"

	"github.com/cleareyeconsulting/qmessentials/calculationbroker/models"
	"go.mongodb.org/mongo-driver/bson"
)

type LotMetricCalculationsRepository struct{}

func (lmcr *LotMetricCalculationsRepository) ListLotMetricCalculationsByLotID(lotID string) (*[]models.LotMetricCalculation, error) {
	ctx, client, _, collection, err := getMongoDB("lotMetricCalculations")
	if err != nil {
		return nil, err
	}
	defer client.Disconnect(ctx)
	csr, err := collection.Find(ctx, bson.D{{Key: "lotId", Value: lotID}})
	if err == nil {
		return nil, err
	}
	var lotMetricCalculations []models.LotMetricCalculation
	err = csr.All(ctx, &lotMetricCalculations)
	if err != nil {
		return nil, err
	}
	return &lotMetricCalculations, nil
}

func (lmcr *LotMetricCalculationsRepository) AddLotMetricCalculations(items *[]models.LotMetricCalculation) error {
	ctx, client, _, collection, err := getMongoDB("lotMetricCalculations")
	if err != nil {
		return err
	}
	defer client.Disconnect(ctx)
	//Go doesn't automatically cast []T to []interface{}, you have to do it explicitly
	recordsToInsert := make([]interface{}, len(*items))
	for i, observation := range *items {
		recordsToInsert[i] = observation
	}
	res, err := collection.InsertMany(ctx, recordsToInsert)
	if err != nil {
		return err
	}
	if len(res.InsertedIDs) != len(*items) {
		return fmt.Errorf("expected to insert %v records, inserted %v", len(res.InsertedIDs), len(*items))
	}
	return nil
}

func (lmcr *LotMetricCalculationsRepository) DeleteLotMetricCalculationsByLotID(lotID string) error {
	ctx, client, _, collection, err := getMongoDB("lotMetricCalculations")
	if err != nil {
		return err
	}
	defer client.Disconnect(ctx)
	res, err := collection.DeleteOne(ctx, bson.D{{Key: "lotId", Value: lotID}})
	if err != nil {
		return err
	}
	if res.DeletedCount != 1 {
		return fmt.Errorf("expected to delete 1 record, deleted %v", res.DeletedCount)
	}
	return nil
}

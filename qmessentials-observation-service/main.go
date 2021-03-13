package main

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os"
	"time"

	"github.com/cleareyeconsulting/qmessentials/observations/models"
	"github.com/go-chi/chi"
	"github.com/joho/godotenv"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func init() {
	godotenv.Load()
}

func main() {
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	zerolog.SetGlobalLevel(zerolog.DebugLevel)
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
	log.Debug().Msg("Started")

	r := chi.NewRouter()
	r.Post("/observations", handlePostObservation)
	r.Get("/observations", handleGetObservations)

	port, ok := os.LookupEnv("PORT")
	if !ok {
		port = "5000"
	}

	http.ListenAndServe(":"+port, r)

}

//observations POST store to database then post to broker
func handlePostObservation(w http.ResponseWriter, r *http.Request) {
	bodyBytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	var observation models.Observation
	err = json.Unmarshal(bodyBytes, &observation)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	err = addObservation(&observation)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

}

//observations GET by lot
func handleGetObservations(w http.ResponseWriter, r *http.Request) {
	panic("Not implemented")
}

func addObservation(observation *models.Observation) error {
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		return err
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel() //Not sure if this is right
	err = client.Connect(ctx)
	if err != nil {
		return err
	}
	defer client.Disconnect(ctx)
	database := client.Database("qmessentialsObservations")
	collection := database.Collection("observations")
	//The commented-out code is to run it in a transaction, but that requires a replica set
	// session, err := client.StartSession()
	// if err != nil {
	// 	return err
	// }
	// defer session.EndSession(ctx)

	// _, err = session.WithTransaction(ctx, func(sessCtx mongo.SessionContext) (interface{}, error) {
	// 	maxItemSequenceNumber, err := getMaxItemSequenceNumber(sessCtx, collection, observation.ItemID)
	// 	if err != nil {
	// 		return nil, err
	// 	}
	// 	maxLotSequenceNumber, err := getMaxLotSequenceNumber(sessCtx, collection, observation.LotID)
	// 	if err != nil {
	// 		return nil, err
	// 	}
	// 	observation.ItemSequenceNumber = *maxItemSequenceNumber + 1
	// 	observation.LotSequenceNumber = *maxLotSequenceNumber + 1
	// 	_, err = collection.InsertOne(sessCtx, &observation)
	// 	if err != nil {
	// 		return nil, err
	// 	}
	// 	return nil, nil
	// })
	maxItemSequenceNumber, err := getMaxItemSequenceNumber(ctx, collection, observation.ItemID)
	if err != nil {
		return err
	}
	observation.ItemSequenceNumber = *maxItemSequenceNumber + 1
	maxLotSequenceNumber, err := getMaxLotSequenceNumber(ctx, collection, observation.LotID)
	if err != nil {
		return err
	}
	observation.LotSequenceNumber = *maxLotSequenceNumber + 1
	_, err = collection.InsertOne(ctx, &observation)
	if err != nil {
		return err
	}
	return nil
}

func getMaxItemSequenceNumber(ctx context.Context, collection *mongo.Collection, itemID string) (*int, error) {
	findOptions := options.Find()
	findOptions.SetSort(bson.D{{Key: "itemSequenceNumber", Value: -1}})
	findOptions.SetLimit(1)
	csr, err := collection.Find(ctx, bson.D{{Key: "itemId", Value: itemID}}, findOptions)
	if err != nil {
		return nil, err
	}
	if !csr.Next(ctx) {
		rv := 0
		return &rv, nil
	}
	var obs models.Observation
	err = csr.Decode(&obs)
	if err != nil {
		return nil, err
	}
	err = csr.Close(ctx)
	if err != nil {
		return nil, err
	}
	return &obs.ItemSequenceNumber, err
}

func getMaxLotSequenceNumber(ctx context.Context, collection *mongo.Collection, lotID string) (*int, error) {
	findOptions := options.Find()
	findOptions.SetSort(bson.D{{Key: "lotSequenceNumber", Value: -1}})
	findOptions.SetLimit(1)
	csr, err := collection.Find(ctx, bson.D{{Key: "lotId", Value: lotID}}, findOptions)
	if err != nil {
		return nil, err
	}
	if !csr.Next(ctx) {
		rv := 0
		return &rv, nil
	}
	var obs models.Observation
	err = csr.Decode(&obs)
	if err != nil {
		return nil, err
	}
	err = csr.Close(ctx)
	if err != nil {
		return nil, err
	}
	return &obs.LotSequenceNumber, err
}

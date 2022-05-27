package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/cleareyeconsulting/qmessentials/calculationbroker/models"
	"github.com/cleareyeconsulting/qmessentials/calculationbroker/repositories"
	"github.com/go-chi/chi"
	"github.com/joho/godotenv"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func init() {
	godotenv.Load()
}

func main() {
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	zerolog.SetGlobalLevel(zerolog.DebugLevel)
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
	log.Info().Msg("Started")

	r := chi.NewRouter()
	r.Post("/observations", handlePostObservation)
	r.Post("/observation-groups", handlePostObservationGroup)
	r.Post("/calculations", handlePostCalculation)
	r.Post("/subscriptions", handlePostSubscription)
	r.Delete("/subscriptions/{id}", handleDeleteSubscription)

	enginesRepo := repositories.EnginesRepository{}
	enginesRepo.DeleteAllEngines()
	requiredEngineURLs := strings.Split(os.Getenv("CALCULATION_ENGINES"), ",")
	for i, url := range requiredEngineURLs {
		engine := models.Engine{
			EngineID:    i,
			EngineURL:   url,
			CreatedDate: time.Now(),
		}
		enginesRepo.AddEngine(&engine)
	}

	port, ok := os.LookupEnv("PORT")
	if !ok {
		port = "5000"
	}

	http.ListenAndServe(":"+port, r)

}

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
	observationAsArray := []models.Observation{observation}
	err = processObservations(&observationAsArray, &bodyBytes)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func handlePostObservationGroup(w http.ResponseWriter, r *http.Request) {
	bodyBytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	var observations []models.Observation
	err = json.Unmarshal(bodyBytes, &observations)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	err = processObservations(&observations, &bodyBytes)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func processObservations(observations *[]models.Observation, rawContent *[]byte) error { //passing raw content as an optimization to avoid re-marshaling the object
	var lotID string
	for i, obs := range *observations {
		if i == 0 {
			lotID = obs.ItemID
		} else {
			if obs.LotID != lotID {
				return errors.New("observations must all be from the same lot")
			}
		}
	}
	subscriptionsRepo := repositories.SubscriptionsRepo{}
	subscriptionCount, err := subscriptionsRepo.CountSubscriptionsForLotID(lotID)
	if err != nil {
		return err
	}
	if subscriptionCount == 0 {
		return nil
	}
	lotsRepo := repositories.LotsRepository{}
	lotByID, err := lotsRepo.SelectLotByID(lotID)
	if err != nil {
		return err
	}
	if lotByID != nil {
		err = postToEngine(lotByID.EngineID, rawContent) //posting to engine based on existing lot assignment, no need to add a lot
		if err != nil {
			return err
		}
		return nil
	}
	allLots, err := lotsRepo.ListAllLots()
	if err != nil {
		return err
	}
	lotsByEngine := make(map[int]int)
	for _, lot := range *allLots {
		lotsByEngine[lot.EngineID] = lotsByEngine[lot.EngineID] + 1
	}
	var minCount int
	for _, count := range lotsByEngine {
		if count < minCount {
			minCount = count
		}
	}
	var engineIDToAssign int
	for engineID, count := range lotsByEngine {
		if count == minCount {
			engineIDToAssign = engineID //will pick the lowest engine number for the min count, but that's OK
			break
		}
	}
	lotToAdd := models.Lot{
		LotID:       lotID,
		EngineID:    engineIDToAssign,
		CreatedDate: time.Now(),
	}
	_, err = lotsRepo.AddLot(&lotToAdd)
	if err != nil {
		return err
	}
	err = postToEngine(engineIDToAssign, rawContent)
	if err != nil {
		return err
	}
	return nil
}

func postToEngine(engineID int, data *[]byte) error {
	enginesRepo := repositories.EnginesRepository{}
	engine, err := enginesRepo.SelectEngineByID(engineID)
	if err != nil {
		return err
	}
	urlToPost := fmt.Sprintf("%s/observations", engine.EngineURL)
	_, err = http.Post(urlToPost, "application/json", bytes.NewBuffer(*data))
	if err != nil {
		return err
	}
	return nil
}

func handlePostCalculation(w http.ResponseWriter, r *http.Request) {
	bodyBytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	lotCalculations := models.LotCalculations{}
	err = json.Unmarshal(bodyBytes, &lotCalculations)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	storageObjects := []models.LotMetricCalculation{}
	for _, lc := range lotCalculations.MetricCalculations {
		storageObject := models.LotMetricCalculation{
			LotID:             lotCalculations.LotID,
			ProductID:         lotCalculations.ProductID,
			Count:             lc.Count,
			MinValue:          lc.MinValue,
			MaxValue:          lc.MaxValue,
			Average:           lc.Average,
			Sum:               lc.Sum,
			FirstQuartile:     lc.FirstQuartile,
			Median:            lc.Median,
			ThirdQuartile:     lc.ThirdQuartile,
			StandardDeviation: lc.StandardDeviation,
			CreatedDate:       time.Now(),
		}
		storageObjects = append(storageObjects, storageObject)
	}
	lmcRepo := repositories.LotMetricCalculationsRepository{}
	err = lmcRepo.AddLotMetricCalculations(&storageObjects)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	subscriptionsRepo := repositories.SubscriptionsRepo{}
	subscriptionsForLot, err := subscriptionsRepo.ListSubscriptionsForLotID(lotCalculations.LotID)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	allCalculationsForLot, err := lmcRepo.ListLotMetricCalculationsByLotID(lotCalculations.LotID)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	allCalculationsJSON, err := json.Marshal(allCalculationsForLot)
	errorChan := make(chan error, len(*subscriptionsForLot))
	wg := sync.WaitGroup{}
	for _, subscription := range *subscriptionsForLot {
		go postCalculationsToSubscriptionCallbackURL(subscription.CallbackURL, &allCalculationsJSON, errorChan)
		wg.Add(1)
	}
	wg.Wait()
	for errorItem := range errorChan {
		if errorItem != nil {
			//We don't want to fail the whole operation if a subscription doesn't send, but we do want to log a warning
			log.Warn().Msgf("Error posting to channel: %s", errorItem.Error())
		}
	}
	w.WriteHeader(http.StatusOK)
}

func postCalculationsToSubscriptionCallbackURL(url string, data *[]byte, errorChan chan<- error) {
	_, err := http.Post(url, "application/json", bytes.NewBuffer(*data))
	errorChan <- err
}

func handlePostSubscription(w http.ResponseWriter, r *http.Request) {
	bodyBytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	var subscription models.Subscription
	err = json.Unmarshal(bodyBytes, &subscription)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	repo := repositories.SubscriptionsRepo{}
	_, err = repo.AddSubscription(&subscription)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func handleDeleteSubscription(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	subscriptionID, err := strconv.Atoi(id)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	subscriptionsRepo := repositories.SubscriptionsRepo{}
	subscription, err := subscriptionsRepo.SelectSubscriptionByID(subscriptionID)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	lmcRepo := repositories.LotMetricCalculationsRepository{}
	err = lmcRepo.DeleteLotMetricCalculationsByLotID(subscription.LotID)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	lotRepo := repositories.LotsRepository{}
	err = lotRepo.DeleteLot(subscription.LotID)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	err = subscriptionsRepo.DeleteSubscription(subscriptionID)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

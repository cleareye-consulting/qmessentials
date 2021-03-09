package main

import (
	"bytes"
	"encoding/json"
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
	subscriptionsRepo := repositories.SubscriptionsRepo{}
	subscriptionsForLot, err := subscriptionsRepo.ListSubscriptionsByLotID(observation.LotID)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if len(*subscriptionsForLot) == 0 {
		w.WriteHeader(http.StatusOK)
		return
	}
	lotsRepo := repositories.LotsRepository{}
	lotByID, err := lotsRepo.SelectLotByID(observation.LotID)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if lotByID != nil {
		err = postToEngine(lotByID.EngineID, &bodyBytes)
		if err != nil {
			log.Error().Err(err).Msg("")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
		return
	}
	allLots, err := lotsRepo.ListAllLots()
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
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
	err = postToEngine(engineIDToAssign, &bodyBytes)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
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
	subscriptionsForLot, err := subscriptionsRepo.ListSubscriptionsByLotID(lotCalculations.LotID)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	errorChan := make(chan error, len(*subscriptionsForLot))
	wg := sync.WaitGroup{}
	for _, subscription := range *subscriptionsForLot {
		go postObservationToSubscriptionCallbackURL(subscription.CallbackURL, &bodyBytes, errorChan)
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

func postObservationToSubscriptionCallbackURL(url string, data *[]byte, errorChan chan<- error) {
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

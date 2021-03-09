package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math"
	"net/http"
	"os"
	"sort"
	"sync"

	"github.com/cleareyeconsulting/qmessentials/calculationengine/models"
	"github.com/go-chi/chi"
	"github.com/go-redis/redis"
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
	log.Debug().Msg("Started")

	r := chi.NewRouter()

	r.Post("/observations", handlePostObservation)

	port, ok := os.LookupEnv("PORT")
	if !ok {
		port = "5000"
	}

	http.ListenAndServe(":"+port, r)

}

//This method will accept a request from anywhere and return a 200 if the request is well-formed
//The handler sends a separate POST to the broker endpoint configured for the environment
func handlePostObservation(w http.ResponseWriter, r *http.Request) {
	incomingObservation := models.Observation{}
	bodyBytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	err = json.Unmarshal(bodyBytes, &incomingObservation)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	redisClient := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})
	var previousObservations []models.Observation
	err = loadPreviousObservationsFromRedis(incomingObservation.LotID, &previousObservations, redisClient)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if !areAllObservationsPresent(&incomingObservation, &previousObservations) {
		log.Warn().Msgf("Unable to find previous observations for lot ID %s", incomingObservation.LotID)
		err = loadPreviousObservationsFromService(incomingObservation.LotID, &previousObservations)
		if err != nil {
			log.Error().Err(err).Msg("")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}
	allObservations := append(previousObservations, incomingObservation)
	allObservationsJSON, err := json.Marshal(allObservations)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	redisClient.Set(incomingObservation.LotID, allObservationsJSON, 1*60*60*1000*1000*1000)
	metricGroups := groupObservationsByMetric(&allObservations)
	calculations := make(chan *models.MetricCalculations, len(*metricGroups))
	var wg sync.WaitGroup
	for metricID, values := range *metricGroups {
		wg.Add(1)
		go getCalculations(metricID, &values, calculations)
	}
	wg.Wait()
	close(calculations)
	result := models.LotCalculations{
		LotID: incomingObservation.LotID,
	}
	for calculation := range calculations {
		result.MetricCalculations = append(result.MetricCalculations, *calculation)
	}
	brokerURL := fmt.Sprintf("%s/calculations", os.Getenv("BROKER_ENDPOINT"))
	calculationsJSON, err := json.Marshal(calculations)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	_, err = http.Post(brokerURL, "application/json", bytes.NewBuffer(calculationsJSON))
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func loadPreviousObservationsFromRedis(lotID string, previousObservations *[]models.Observation, redisClient *redis.Client) error {
	previousObservationsAsString, err := redisClient.Get(lotID).Result()
	if err == redis.Nil {
		return nil //It's not there, just don't load anything into the results
	}
	if err != nil {
		return err
	}
	err = json.Unmarshal([]byte(previousObservationsAsString), &previousObservations)
	if err != nil {
		return err
	}
	return nil
}

func areAllObservationsPresent(inputObservation *models.Observation, previousObservations *[]models.Observation) bool {
	for i := 1; i < inputObservation.LotSequenceNumber; i++ {
		found := false
		for _, obs := range *previousObservations {
			if obs.LotSequenceNumber == i {
				found = true
				break
			}
		}
		if !found {
			return false
		}
	}
	return true
}

func loadPreviousObservationsFromService(lotID string, previousObservations *[]models.Observation) error {
	observationServiceURL := fmt.Sprintf("%s/observations?lotId=%s", os.Getenv("OBSERVATION_SERVICE_ENDPOINT"), lotID)
	resp, err := http.Get(observationServiceURL)
	if err != nil {
		return err
	}
	bodyBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return err
	}
	err = json.Unmarshal(bodyBytes, &previousObservations)
	if err != nil {
		return err
	}
	return nil
}

func groupObservationsByMetric(observations *[]models.Observation) *map[string][]float64 {
	groups := make(map[string][]float64)
	for _, obs := range *observations {
		newGroup := append(groups[obs.MetricID], obs.Values...)
		sort.Float64s(newGroup)
		groups[obs.MetricID] = newGroup
	}
	return &groups
}

func getCalculations(metricID string, values *[]float64, out chan<- *models.MetricCalculations) {
	calculations := models.MetricCalculations{
		MetricID: metricID,
		MinValue: math.MaxFloat64,
		MaxValue: math.SmallestNonzeroFloat64,
	}
	for _, val := range *values {
		calculations.Count++
		calculations.Sum += val
		if val < calculations.MinValue {
			calculations.MinValue = val
		}
		if val > calculations.MaxValue {
			calculations.MaxValue = val
		}
	}
	calculations.Average = float64(calculations.Sum) / float64(calculations.Count)
	firstQuartilePosition := int(math.Floor(float64(calculations.Count) / 4))
	medianPosition := int(math.Ceil(float64(calculations.Count) / 2))
	thirdQuartilePosition := int(math.Ceil(float64(calculations.Count) * 3 / 4))
	sumOfSquaredDeviations := 0.0
	for i, val := range *values {
		if i == firstQuartilePosition {
			calculations.FirstQuartile = val
		}
		if i == medianPosition {
			calculations.Median = val
		}
		if i == thirdQuartilePosition {
			calculations.ThirdQuartile = val
		}
		deviation := val - calculations.Average
		square := math.Pow(deviation, 2)
		sumOfSquaredDeviations += square
	}
	calculations.StandardDeviation = math.Sqrt(sumOfSquaredDeviations)
	out <- &calculations
}

//the incoming observation should have a sequence number n
//there should already be observations for sequence numbers 1..n
//if not, get all observations from the observation service
//add observation (new or all) to cache, keyed by LotID
//rearrange observations into one array per metric, ordered by values
//(there can be multiple values on an observation, but just one metric)
//do calculations on each group
//combine groups and return to broker

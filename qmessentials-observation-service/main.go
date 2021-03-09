package main

import (
	"net/http"
	"os"

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
	panic("Not implemented")
}

//observations GET by lot
func handleGetObservations(w http.ResponseWriter, r *http.Request) {
	panic("Not implemented")
}

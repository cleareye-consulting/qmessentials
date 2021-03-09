package main

import (
	"context"
	"fmt"
	"net/http"
	"os"

	"github.com/cleareyeconsulting/qmessentials/observations/models"
	"github.com/go-chi/chi"
	"github.com/jackc/pgx/v4/pgxpool"
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

func addObservation(observation *models.Observation) error {
	// db := pg.Connect(&pg.Options{
	// 	User:     os.Getenv("DATABASE_USER"),
	// 	Database: os.Getenv("DATABASE_NAME"),
	// })
	// defer db.Close()
	// tx, err := db.Begin()
	// if err != nil {
	// 	return err
	// }
	// tx.Exec("set transaction isolation level serializable")
	// res, err := tx.Query("select max(lot_sequence_number) from observations where lot_id = ")
	dbpool, err := pgxpool.Connect(context.Background(), fmt.Sprintf("host=localhost; Database=%s; User ID=%s", os.Getenv("DATABASE_NAME"), os.Getenv("DATABASE_USER")))
	if err != nil {
		return err
	}
	defer dbpool.Close()
	ctx := context.Background()
	tx, err := dbpool.Begin(ctx)
	if err != nil {
		return err
	}
	_, err = tx.Exec(ctx, "set transaction isolation level serializable")
	if err != nil {
		tx.Rollback(ctx)
		return err
	}
	var maxItemSequenceNumber int
	var maxLotSequenceNumber int
	tx.QueryRow(ctx, "select max(item_sequence_number) from observations where item_id = %s", observation.ItemID).Scan(&maxItemSequenceNumber)
	tx.QueryRow(ctx, "select max(lot_sequence_number) from observations where lot_id = %s", observation.LotID).Scan(&maxLotSequenceNumber)
	observation.ItemSequenceNumber = maxItemSequenceNumber + 1
	observation.LotSequenceNumber = maxLotSequenceNumber + 1
	_, err = tx.Exec(ctx, "insert observations (observation_id, metric_id, item_")
}

package main

import (
	"net/http"
	"os"

	"github.com/cleareyeconsulting/qmessentials/configuration/routers"
	"github.com/go-chi/chi"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func defaultHandler(w http.ResponseWriter, r *http.Request) {
	log.Debug().Msg("Home called")
	w.Write([]byte("home"))
}

func main() {
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	zerolog.SetGlobalLevel(zerolog.DebugLevel)
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
	log.Debug().Msg("Started")

	r := chi.NewRouter()
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Test"))
	})
	r.Route("/products", func(r chi.Router) {
		productsRouter := routers.ProductsRouter{}
		r.Get("/{id}", productsRouter.HandleGetById)
		r.Get("/", productsRouter.HandleGet)
		r.Post("/", productsRouter.HandlePost)
		r.Put("/{id}", productsRouter.HandlePut)
		r.Delete("/{id}", productsRouter.HandleDelete)
	})

	http.ListenAndServe(":5000", r)
}

package main

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os"
	"strings"

	"github.com/cleareyeconsulting/qmessentials/configuration/models"
	"github.com/cleareyeconsulting/qmessentials/configuration/routers"
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
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Test"))
	})

	//testers can read products, lots, items, and metrics
	//configurers can read and write products, lots, items, and metrics

	r.Route("/products", func(r chi.Router) {
		productsRouter := routers.ProductsRouter{}
		r.Get("/{id}", productsRouter.HandleGetById)
		r.Get("/", productsRouter.HandleGet)
		r.Group(func(r chi.Router) {
			r.Use(requireAnalystRole)
			r.Post("/", productsRouter.HandlePost)
			r.Put("/{id}", productsRouter.HandlePut)
			r.Delete("/{id}", productsRouter.HandleDelete)
		})
	})

	port, ok := os.LookupEnv("PORT")
	if !ok {
		port = "5000"
	}

	http.ListenAndServe(":"+port, r)
}

func requireAnalystRole(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		roles, err := getRoles(authHeader)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		if roles == nil {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		for _, role := range *roles {
			if role == "Administrator" {
				next.ServeHTTP(w, r)
				return
			}
		}
		w.WriteHeader(http.StatusUnauthorized)
	})
}

func getRoles(authHeader string) (*[]string, error) {
	if !strings.HasPrefix(authHeader, "Bearer ") {
		return nil, nil
	}
	token := strings.TrimPrefix(authHeader, "Bearer ")
	r, err := http.Post(os.Getenv("AUTH_SERVICE_URL")+"/tokens", "text/plain", bytes.NewBufferString(token))
	if err != nil {
		return nil, err
	}
	responseData, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return nil, err
	}
	var user models.User
	err = json.Unmarshal(responseData, &user)
	if err != nil {
		return nil, err
	}
	var roles []string
	for _, claim := range user.Claims {
		if claim.ClaimType == "role" {
			for _, role := range claim.ClaimValues {
				roles = append(roles, role)
			}
		}
	}
	return &roles, nil
}

package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/cleareyeconsulting/qmessentials/configuration/models"
	"github.com/cleareyeconsulting/qmessentials/configuration/repositories"
	"github.com/go-chi/chi"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func defaultHandler(w http.ResponseWriter, r *http.Request) {
	log.Debug().Msg("Home called")
	w.Write([]byte("home"))
}

// func productsHandler(w http.ResponseWriter, r *http.Request) {
// 	//log.Debug().Stringer("url", r.URL)
// 	productRepo := repositories.ProductRepository{}
// 	switch r.Method {
// 	case http.MethodGet:
// 		products, err := productRepo.List()
// 		if err != nil {
// 			log.Error().Err(err).Msg("")
// 			w.WriteHeader(http.StatusInternalServerError)
// 			return
// 		}
// 		responseContent, err := json.Marshal(products)
// 		if err != nil {
// 			log.Error().Err(err).Msg("")
// 			w.WriteHeader(http.StatusInternalServerError)
// 			return
// 		}
// 		w.Header().Set("Content-Type", "application/json")
// 		w.Write(responseContent)
// 	case http.MethodPost:
// 		var product models.Product
// 		bodyBytes, err := ioutil.ReadAll(r.Body)
// 		if err != nil {
// 			log.Error().Err(err).Msg("")
// 			w.WriteHeader(http.StatusInternalServerError)
// 			return
// 		}
// 		err = json.Unmarshal(bodyBytes, &product)
// 		if err != nil {
// 			log.Error().Err(err).Msg("")
// 			w.WriteHeader(http.StatusInternalServerError)
// 			return
// 		}
// 		err = productRepo.Add(&product)
// 		if err != nil {
// 			log.Error().Err(err).Msg("")
// 			w.WriteHeader(http.StatusInternalServerError)
// 			return
// 		}
// 		w.WriteHeader(http.StatusCreated)
// 	default:
// 		w.WriteHeader(http.StatusMethodNotAllowed)
// 	}

// }

// func productHandler(w http.ResponseWriter, r *http.Request) {
// 	log.Debug().Stringer("url", r.URL)
// 	productRepo := repositories.ProductRepository{}
// 	urlPathSegments := strings.Split(r.URL.Path, "products/")
// 	productID := urlPathSegments[len(urlPathSegments)-1]
// 	product, err := productRepo.Select(productID)
// 	if err != nil {
// 		log.Error().Err(err).Msg("")
// 		w.WriteHeader(http.StatusInternalServerError)
// 		return
// 	}
// 	switch r.Method {
// 	case http.MethodGet:
// 		productJSON, err := json.Marshal(product)
// 		if err != nil {
// 			log.Error().Err(err).Msg("")
// 			w.WriteHeader(http.StatusInternalServerError)
// 			return
// 		}
// 		w.Header().Set("Content-Type", "application/json")
// 		w.Write(productJSON)
// 	case http.MethodPut:
// 		bodyBytes, err := ioutil.ReadAll(r.Body)
// 		if err != nil {
// 			log.Error().Err(err).Msg("")
// 			w.WriteHeader(http.StatusInternalServerError)
// 			return
// 		}
// 		var product models.Product
// 		err = json.Unmarshal(bodyBytes, &product)
// 		if err != nil {
// 			log.Error().Err(err).Msg("")
// 			w.WriteHeader(http.StatusInternalServerError)
// 			return
// 		}
// 		if product.ProductID != productID {
// 			w.WriteHeader(http.StatusBadRequest)
// 			return
// 		}
// 		err = productRepo.Update(productID, &product)
// 		if err != nil {
// 			log.Error().Err(err).Msg("")
// 			w.WriteHeader(http.StatusInternalServerError)
// 			return
// 		}
// 		w.WriteHeader(http.StatusOK)
// 	case http.MethodDelete:
// 		err := productRepo.Delete(productID)
// 		if err != nil {
// 			log.Error().Err(err).Msg("")
// 			w.WriteHeader(http.StatusInternalServerError)
// 			return
// 		}
// 		w.WriteHeader(http.StatusOK)
// 	default:
// 		w.WriteHeader(http.StatusMethodNotAllowed)
// 	}

// }

func main() {
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	zerolog.SetGlobalLevel(zerolog.DebugLevel)
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
	log.Debug().Msg("Started")

	r := chi.NewRouter()
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Test"))
	})
	r.Get("/products/{id}", handleGetProduct)
	r.Get("/products", handleGetProducts)
	r.Post("/products", handlePostProduct)
	r.Put("/products/{id}", handlePutProduct)
	r.Delete("/products/{id}", handleDeleteProduct)
	http.ListenAndServe(":5000", r)
}

func handleGetProduct(w http.ResponseWriter, r *http.Request) {
	productID := chi.URLParam(r, "id")
	productRepo := repositories.ProductRepository{}
	product, err := productRepo.Select(productID)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	productJSON, err := json.Marshal(product)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(productJSON)
}

func handleGetProducts(w http.ResponseWriter, r *http.Request) {
	productRepo := repositories.ProductRepository{}
	products, err := productRepo.List()
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	responseContent, err := json.Marshal(products)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(responseContent)
}

func handlePostProduct(w http.ResponseWriter, r *http.Request) {
	productRepo := repositories.ProductRepository{}
	var product models.Product
	bodyBytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	err = json.Unmarshal(bodyBytes, &product)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	err = productRepo.Add(&product)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
}

func handlePutProduct(w http.ResponseWriter, r *http.Request) {
	productID := chi.URLParam(r, "id")
	productRepo := repositories.ProductRepository{}
	bodyBytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	var product models.Product
	err = json.Unmarshal(bodyBytes, &product)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if product.ProductID != productID {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	err = productRepo.Update(productID, &product)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func handleDeleteProduct(w http.ResponseWriter, r *http.Request) {
	productID := chi.URLParam(r, "id")
	productRepo := repositories.ProductRepository{}
	err := productRepo.Delete(productID)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

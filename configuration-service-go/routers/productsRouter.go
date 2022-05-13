package routers

import (
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/cleareyeconsulting/qmessentials/configuration/models"
	"github.com/cleareyeconsulting/qmessentials/configuration/repositories"
	"github.com/go-chi/chi"
	"github.com/rs/zerolog/log"
)

type ProductsRouter struct{}

func (pr *ProductsRouter) HandleGetById(w http.ResponseWriter, r *http.Request) {
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

func (pr *ProductsRouter) HandleGet(w http.ResponseWriter, r *http.Request) {
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

func (pr *ProductsRouter) HandlePost(w http.ResponseWriter, r *http.Request) {
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

func (pr *ProductsRouter) HandlePut(w http.ResponseWriter, r *http.Request) {
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

func (pr *ProductsRouter) HandleDelete(w http.ResponseWriter, r *http.Request) {
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

package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/cleareyeconsulting/qmessentials/configuration/models"
	"github.com/cleareyeconsulting/qmessentials/configuration/repositories"
)

func productsHandler(w http.ResponseWriter, r *http.Request) {
	productRepo := repositories.ProductRepository{}
	switch r.Method {
	case http.MethodGet:
		products, err := productRepo.List()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		responseContent, err := json.Marshal(products)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(responseContent)
	case http.MethodPost:
		var product models.Product
		bodyBytes, err := ioutil.ReadAll(r.Body)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		err = json.Unmarshal(bodyBytes, &product)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		err = productRepo.Add(&product)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}

}

func productHandler(w http.ResponseWriter, r *http.Request) {
	productRepo := repositories.ProductRepository{}
	urlPathSegments := strings.Split(r.URL.Path, "products/")
	productID := urlPathSegments[len(urlPathSegments)-1]
	product, err := productRepo.Select(productID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	switch r.Method {
	case http.MethodGet:
		productJSON, err := json.Marshal(product)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(productJSON)
	case http.MethodPut:
		bodyBytes, err := ioutil.ReadAll(r.Body)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		var product models.Product
		err = json.Unmarshal(bodyBytes, &product)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		if product.ProductID != productID {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		err = productRepo.Update(productID, &product)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	case http.MethodDelete:
		err := productRepo.Delete(productID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}

}

func main() {
	http.HandleFunc("/products", productsHandler)
	http.HandleFunc("/products/", productHandler)
	http.ListenAndServe(":5000", nil)
}

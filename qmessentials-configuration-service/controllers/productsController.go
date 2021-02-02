package controllers

import (
	"net/http"
	"regexp"
)

type productsController struct {
	productIDPattern *regexp.Regexp
}

func (pc productsController) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello"))
}

func newProductsController() *productsController {
	return &productsController{
		productIDPattern: regexp.MustCompile(`^/products/[A-Z0-9]+$`),
	}
}

package models

//Product definition
type Product struct {
	ProductID   string `json:"productId" pg:",pk"`
	ProductName string `json:"productName"`
}

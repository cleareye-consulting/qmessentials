package models

import "time"

//Product definition
type Product struct {
	ProductID   string    `json:"productId"`
	ProductName string    `json:"productName"`
	CreatedDate time.Time `json:"createdDate"`
}

package models

import "time"

//Product definition
type Product struct {
	ProductID   string    `bson:"productId" json:"productId"`
	ProductName string    `bson:"productName" json:"productName"`
	IsActive    bool      `bson:"isActive" json:"isActive"`
	CreatedDate time.Time `bson:"createdDate" json:"createdDate"`
}

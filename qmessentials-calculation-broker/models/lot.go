package models

import "time"

type Lot struct {
	LotID       string
	EngineID    int
	CreatedDate time.Time
}

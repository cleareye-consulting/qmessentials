package models

import "time"

type Engine struct {
	EngineID    int
	EngineURL   string
	CreatedDate time.Time
}

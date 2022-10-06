package repositories

import (
	"context"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func getMongoDB(collectionName string) (context.Context, *mongo.Client, *mongo.Database, *mongo.Collection, error) {
	client, err := mongo.NewClient(options.Client().ApplyURI(os.Getenv("MONGODB_CONNECTION_STRING")))
	if err != nil {
		return nil, nil, nil, nil, err
	}
	ctx := context.Background()
	err = client.Connect(ctx)
	if err != nil {
		return nil, nil, nil, nil, err
	}
	database := client.Database(os.Getenv("MONGODB_DATABASE_NAME"))
	collection := database.Collection(collectionName)
	return ctx, client, database, collection, nil
}

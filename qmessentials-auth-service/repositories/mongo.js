import { MongoClient } from 'mongodb'

export async function getMongoClient() {
  const client = new MongoClient(`mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`)
  const connection = await client.connect()
  const db = connection.db(process.env.MONGODB_DATABASE_NAME)
  return [client, connection, db]
}

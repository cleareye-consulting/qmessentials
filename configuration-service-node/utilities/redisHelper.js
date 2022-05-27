import { createClient } from 'redis'

export async function getRedisClient() {
  const client = createClient({ url: process.env.REDIS_URL })
  await client.connect()
  return client
}

export async function getUserIdForToken(client, token) {
  const userId = await client.get(`token:${token}`)
  return userId
}

export async function addUserIdForToken(client, token, userId) {
  await client.set(`token${token}`, userId)
}

export async function getServiceToken(client) {
  const token = await client.get(`service_token`)
  return token
}

export async function addServiceToken(client, token) {
  await client.set('service_token', token)
}

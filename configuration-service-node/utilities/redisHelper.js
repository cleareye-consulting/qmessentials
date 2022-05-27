import { createClient } from 'redis'

export async function getUserIdForToken(token) {
  const client = createClient({ url: process.env.REDIS_URL })
  await client.connect()
  //client.on('error', (err) => console.log('Redis Client Error', err))
  const userId = await client.get(`token:{token}`)
  client.quit()
  return userId
}

export async function addUserIdForToken(token, userId) {}

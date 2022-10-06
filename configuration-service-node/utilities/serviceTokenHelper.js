import { getServiceToken as getServiceTokenFromAuth } from '../apis/authService.js'
import { redisClient } from '../app.js'
import { setServiceToken, getServiceToken as getServiceTokenFromRedis } from './redisHelper.js'

export async function getServiceToken() {
  const serviceTokenFromRedis = getServiceTokenFromRedis(redisClient)
  if (serviceTokenFromRedis) {
    return serviceTokenFromRedis
  }
  const serviceTokenFromAuth = getServiceTokenFromAuth()
  setServiceToken(this.redisClient, serviceTokenFromAuth)
  return serviceTokenFromAuth
}

//The only purpose of this is to avoid an explicit dependency on redisClient from with in the auth code
export async function onServiceTokenUpdated(newToken) {
  setServiceToken(redisClient, newToken)
}

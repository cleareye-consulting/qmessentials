import axios from 'axios'
import { getPermission, postLogin } from '../apis/authService.js'
import { logger, redisClient } from '../app.js'
import { getServiceToken, addServiceToken } from './redisHelper.js'

async function getServiceTokenLocal() {
  const serviceTokenFromRedis = await getServiceToken(redisClient)
  if (serviceTokenFromRedis) {
    return serviceTokenFromRedis
  }
  logger.info('Service token not found in cache, regenerating...')
  const newToken = await postLogin({ userId: process.env.SERVICE_USER, password: process.env.SERVICE_PASSWORD })
  logger.info(`New token is ${newToken}`)
  return await addServiceToken(redisClient, newToken)
}

export async function userHasPermissions(userId, permissionName) {
  const serviceToken = await getServiceTokenLocal()
  return await getPermission(serviceToken, userId, permissionName)
}

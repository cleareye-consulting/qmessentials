import axios from 'axios'
import { logger } from '../app.js'
import { onServiceTokenUpdated } from '../utilities/serviceTokenHelper.js'

export async function getPermission(serviceToken, userId, permissionName) {
  return getWithToken(`${process.env.AUTH_SERVICE_ENDPOINT}/permissions`, serviceToken, { userId, permissionName })
}

export async function getUsers(token) {
  const response = await axios.get(`${process.env.AUTH_SERVICE_ENDPOINT}/users`, { params: { token } })
  return response.data
}

export async function getServiceToken() {
  const newTokenResponse = await axios.post(`${process.env.AUTH_SERVICE_ENDPOINT}/logins`, {
    userId: process.env.SERVICE_USER,
    password: process.env.SERVICE_PASSWORD,
  })
  return newTokenResponse.data
}

async function getWithToken(url, serviceToken, params) {
  //Try with the cached token. If it fails (probably due to timeout), try again getting a fresh token, and fire a callback to update redis.
  const get = async () =>
    await axios.get(url, {
      headers: { Authorization: `Bearer ${serviceToken}` },
      params,
    })
  try {
    const response = await get()
    return response.data
  } catch (error) {
    if (error.response.status === 401) {
      const newServiceToken = await getServiceToken()
      logger.info('Obtaining new service token')
      await onServiceTokenUpdated(newServiceToken)
      const newResponse = await get()
      return newResponse
    }
    throw error
  }
}

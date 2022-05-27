import axios from 'axios'

export async function postLogin(login) {
  const newTokenResponse = await axios.post(`${process.env.AUTH_SERVICE_ENDPOINT}/logins`, login)
  return newTokenResponse.data
}

export async function getPermission(serviceToken, userId, permissionName) {
  const response = await axios.get(`${process.env.AUTH_SERVICE_ENDPOINT}/permissions`, {
    headers: { Authorization: `Bearer ${serviceToken}` },
    params: { userId, permissionName },
  })
  return response.data
}

export async function getUsers(token) {
  const response = await axios.get(`${process.env.AUTH_SERVICE_ENDPOINT}/users`, { params: { token } })
  return response.data
}

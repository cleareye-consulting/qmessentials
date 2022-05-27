import axios from 'axios'

export async function userHasPermissions(userId, permissionName) {
  const response = await axios.get(`${process.env.AUTH_SERVICE_ENDPOINT}/permissions`, { params: { userId, permissionName } })
  return response
}

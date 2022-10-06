import { getPermission } from '../apis/authService.js'
import { getServiceToken } from './serviceTokenHelper.js'

export async function userHasPermissions(userId, permissionName) {
  const serviceToken = await getServiceToken()
  return await getPermission(serviceToken, userId, permissionName)
}

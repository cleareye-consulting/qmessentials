import { getUser } from '../repositories/users.js'

export async function isAuthorized(userId, permission) {
  const user = await getUser(userId)
  if (user.roles.includes('Administrator')) {
    return true
  }
  return false
}

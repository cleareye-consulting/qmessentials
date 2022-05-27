import { getUser } from '../repositories/users.js'

export async function isAuthorized(userId, permission) {
  const user = await getUser(userId)
  if (user.roles.includes('Administrator')) {
    return true
  }
  if (permission === 'CHECK PERMISSION') {
    return (
      user.roles.length === 1 &&
      (user.roles[0] === 'Configuration Service' ||
        user.roles[0] === 'Auth Service' ||
        user.roles[0] === 'Observation Service' ||
        user.roles[0] === 'Subscription Service')
    )
  }
  if (permission === 'CREATE USER' || permission === 'EDIT USER') {
    return false //only the administrator can create or edit users
  }
  return false
}

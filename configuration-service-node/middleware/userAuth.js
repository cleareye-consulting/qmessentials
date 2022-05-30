import { getUsers } from '../apis/authService.js'
import { redisClient, logger } from '../app.js'
import { addUserIdForToken, getUserIdForToken } from '../utilities/redisHelper.js'

export default async function addUserId(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    logger.warn('No user ID on request')
    return res.sendStatus(401)
  }
  const authHeaderMatch = /^Bearer (.*)/i.exec(authHeader)
  if (!authHeaderMatch) {
    logger.warn('Non-bearer auth header found')
    return res.sendStatus(403)
  }
  const token = authHeaderMatch[1]
  const userIdFromRedis = getUserIdForToken(redisClient, token)
  if (userIdFromRedis) {
    req.user = userIdFromRedis
  } else {
    const userId = await getUsers(token)[0].userId
    addUserIdForToken(redisClient, token, userId)
    req.user = userId
  }
  next()
}

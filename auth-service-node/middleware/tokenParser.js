import { logger } from '../app.js'
import { verifyToken } from '../util/jwtHelper.js'

export function getUserIdFromToken(token) {
  const parsed = verifyToken(token)
  return parsed.sub
}

export function addTokenUserToRequest(req, res, next) {
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
  const parsed = verifyToken(token)
  logger.info(`Authenticated user ID ${parsed.sub} added to request`)
  req.user = parsed.sub
  next()
}

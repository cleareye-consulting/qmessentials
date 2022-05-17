import { logger } from '../app.js'
import { verifyToken } from '../util/jwtHelper.js'

export function addTokenUserToRequest(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    logger.warn('No user ID on request')
    res.sendStatus(401)
    return
  }
  const authHeaderMatch = /^Bearer (.*)/i.exec(authHeader)
  if (!authHeaderMatch) {
    logger.warn('Non-bearer auth header found')
    res.sendStatus(403)
    return
  }
  const token = authHeaderMatch[1]
  const parsed = verifyToken(token)
  logger.info(`Authenticated user ID ${parsed.sub} added to request`)
  req.user = parsed.sub
  next()
}

import jsonwebtoken from 'jsonwebtoken'
import { logger } from '../app.js'
import { verifyToken } from '../util/jwtHelper.js'

const { TokenExpiredError } = jsonwebtoken

export function getUserIdFromToken(token) {
  const parsed = verifyToken(token)
  if (!parsed || !parsed.sub) {
    return null
  }
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
  try {
    const parsed = verifyToken(token)
    logger.info(`Authenticated user ID ${parsed.sub} added to request`)
    req.user = parsed.sub
    next()
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.sendStatus(401)
    }
    throw error
  }
}

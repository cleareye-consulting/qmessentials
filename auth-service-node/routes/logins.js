import { Router } from 'express'
import { logger } from '../app.js'
import { getUser } from '../repositories/users.js'
import { getToken } from '../util/jwtHelper.js'
import { comparePasswords } from '../util/passwordHelper.js'

const router = Router()

router.post('/', async (req, res) => {
  const login = req.body
  const user = await getUser(login.userId)
  const isValid = await comparePasswords(login.password, user.password)
  if (!isValid) {
    logger.warn(`Failed login attempt for user ${login.userId} with password ${login.password}`)
    return res.sendStatus(401)
  }
  const token = getToken(login.userId)
  return res.send(token)
})

export default router

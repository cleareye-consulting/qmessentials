import { Router } from 'express'
import { getUser } from '../repositories/users.js'
import { getToken } from '../util/jwtHelper.js'
import { comparePasswords } from '../util/passwordHelper.js'

const router = Router()

router.post('/', async (req, res) => {
  const login = req.body
  const user = await getUser(login.userId)
  const isValid = await comparePasswords(login.password, user.password)
  if (!isValid) {
    res.sendStatus(401)
    return
  }
  const token = getToken(login.userId)
  res.send(token)
})

export default router

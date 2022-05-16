import { Router } from 'express'
import { getUser } from '../repositories/users.js'
var router = Router()

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

router.get('/:userId', async function (req, res, next) {
  const { userId } = req.params
  const user = await getUser(userId)
  res.send(user)
})

export default router

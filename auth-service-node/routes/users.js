import { Router } from 'express'
import { addUser, getUser, updateUser } from '../repositories/users.js'
const router = Router()

router.get('/:userId', async (req, res) => {
  const { userId } = req.params
  const user = await getUser(userId)
  const limitedUser = { userId: user.userId, givenNames: user.givenNames, familyNames: user.familyNames, roles: user.roles }
  return res.send(limitedUser)
})

router.post('/', async (req, res) => {
  const userId = await addUser(req.body)
  return res.send(userId)
})

router.put('/:userId', async (req, res) => {
  const { userId } = req.params
  await updateUser(userId, req.body)
  return res.sendStatus(200)
})

export default router

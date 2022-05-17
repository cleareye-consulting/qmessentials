import { Router } from 'express'
import { getUser } from '../repositories/users.js'
const router = Router()

router.get('/:userId', async (req, res) => {
  const { userId } = req.params
  const user = await getUser(userId)
  const limitedUser = { userId: user.userId, givenNames: user.givenNames, familyNames: user.familyNames, roles: user.roles }
  res.send(limitedUser)
})

export default router

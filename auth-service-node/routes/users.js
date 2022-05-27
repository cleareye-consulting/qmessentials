import { Router } from 'express'
import { getUserIdFromToken } from '../middleware/tokenParser.js'
import { addUser, getUser, updateUser } from '../repositories/users.js'
const router = Router()

async function getLimitedUserById(userId) {
  const user = await getUser(userId)
  const limitedUser = { userId: user.userId, givenNames: user.givenNames, familyNames: user.familyNames, roles: user.roles }
  return limitedUser
}

router.get('/:userId', async (req, res) => {
  const { userId } = req.params
  const limitedUser = await getLimitedUserById(userId)
  return res.send(limitedUser)
})

router.get('/', async (req, res) => {
  const { token } = req.query
  if (!token) {
    throw 'User can only be retrieved by ID or token'
  }
  const userId = getUserIdFromToken(token)
  const limitedUser = await getLimitedUserById(userId)
  return res.send([limitedUser]) //returning an array for consistency with convention;
  //later versions of this method might allow other types of user searches
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

import { Router } from 'express'
import { isAuthorized } from '../util/permissionHelper.js'

const router = Router()

router.get('/', async (req, res) => {
  if (!(await isAuthorized(req.userId, 'CHECK PERMISSIONS'))) {
    return res.send(false)
  }
  const { userId, permissionName } = req.query
  const auth = await isAuthorized(userId, permissionName)
  return res.send(auth)
})

export default router

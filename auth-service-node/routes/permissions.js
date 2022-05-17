import { Router } from 'express'
import { isAuthorized } from '../util/permissionHelper.js'

const router = Router()

router.get('/', async (req, res) => {
  const { permissionRequested } = req.query
  const auth = await isAuthorized(req.user, permissionRequested)
  res.json(auth)
})

export default router

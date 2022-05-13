import { Router } from 'express'
import { getMultiple, post } from '../controllers/products.js'

const router = new Router()

router.get('/', getMultiple)
router.post('/', post)

export default router

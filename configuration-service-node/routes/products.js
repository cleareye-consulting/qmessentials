import { Router } from 'express'
import { getMultiple, post, put } from '../controllers/products.js'

const router = new Router()

router.get('/', getMultiple)
router.post('/', post)
router.put('/:productId', put)

export default router

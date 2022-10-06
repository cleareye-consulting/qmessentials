import { Router } from 'express'
import { getMultiple, getSingle, post, put } from '../controllers/products.js'

const router = new Router()

router.get('/:productId', getSingle)
router.get('/', getMultiple)
router.post('/', post)
router.put('/:productId', put)

export default router

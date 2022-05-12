import { Router } from 'express'
import { list } from '../controllers/products.js'

const router = new Router()

router.get('/', list)

export default router

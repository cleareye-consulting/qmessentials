import { Router } from 'express'
var router = Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send(new Date().toISOString())
})

export default router

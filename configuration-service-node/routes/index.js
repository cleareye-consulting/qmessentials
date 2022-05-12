import { Router } from 'express'
var router = Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.write(`QMEssentials Configuration Service ${new Date().toLocaleTimeString()}`)
  res.end()
})

export default router

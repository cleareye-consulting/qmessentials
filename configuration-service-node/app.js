import express, { json, urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import winston from 'winston'

import indexRouter from './routes/index.js'
import productsRouter from './routes/products.js'
import { getRedisClient } from './utilities/redisHelper.js'
import addUserId from './middleware/userAuth.js'

var app = express()

app.use(morgan('dev'))

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  )
}

app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/', indexRouter)

app.use(addUserId)

app.use('/products', productsRouter)

export const redisClient = await getRedisClient()

export default app

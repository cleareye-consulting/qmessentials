import express, { json, urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import winston from 'winston'

import indexRouter from './routes/index.js'
import usersRouter from './routes/users.js'
import loginsRouter from './routes/logins.js'
import permissionsRouter from './routes/permissions.js'

import { bootstrapAdminUser, bootstrapServiceAccounts } from './repositories/users.js'
import { addTokenUserToRequest } from './middleware/tokenParser.js'

const app = express()

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

app.use(addTokenUserToRequest) //This middleware returns 401 if there's not a valid bearer token
app.use('/users', usersRouter)
app.use('/logins', loginsRouter)
app.use('/permissions', permissionsRouter)

bootstrapAdminUser()
bootstrapServiceAccounts()

export default app

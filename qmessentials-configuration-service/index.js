import express from 'express'
import productsRouter from './src/routers/productsRouter.js'
const app = express()

app.get('/', (req, res) => {
  res.send('Hello')
})

app.use('/products', productsRouter)

app.use((err, res, req, next) => {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500)
  res.render('error', { error: err })
})

const port = process.env.PORT || 3010

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

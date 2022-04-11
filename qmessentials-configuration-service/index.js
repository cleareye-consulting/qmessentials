const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('Hello')
})

const port = process.env.PORT || 3010
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

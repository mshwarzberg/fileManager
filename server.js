const express = require('express')
const app = express()
const explorer = require('./routes/explorer')

app.use(express.json())

app.listen(5000)

app.use('/api/explorer', explorer)
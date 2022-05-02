const express = require('express')
const app = express()
const explorer = require('./routes/explorer')
const loadfiles = require('./routes/loadfiles')

app.use(express.json())

app.listen(5000)

app.use('/api/explorer', explorer)
app.use('/api/loadfiles', loadfiles)
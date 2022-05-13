const express = require('express')
const app = express()
const sendfiledata = require('./routes/sendfiledata')
const loadfiles = require('./routes/loadfiles')
const getdirectories = require('./routes/getdirectories')

app.use(express.json())

app.listen(5000)

app.use('/api/data', sendfiledata)
app.use('/api/loadfiles', loadfiles)
app.use('/api/getdirectories', getdirectories)
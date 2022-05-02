const express = require('express')
const router = express.Router()
const fs = require('fs')

router.post('/image', (req, res) => {
  const options = {
    root: './',
    headers: {
      name: req.body.name
    }
  }
  res.sendFile(`/${req.body.currentdirectory}/${req.body.name}`, options)
})

module.exports = router
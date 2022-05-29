const express = require('express')
const router = express.Router()
const fs = require('fs')

router.patch('/', (req, res) => {
  fs.writeFile(req.body.path, req.body.document, {
    encoding: 'utf8', 
    flag: 'w',
  }, (err) => {
    if (err) {
      return console.log(err)
    } else {
      res.send({msg: 'success'})
    }
  })
})

module.exports = router
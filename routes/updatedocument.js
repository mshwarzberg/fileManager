const express = require('express')
const router = express.Router()
const fs = require('fs')

router.post('/', (req, res) => {
  fs.writeFile(req.body.path, req.body.document, {
    encoding: 'utf8', 
    flag: 'w',
  }, (err) => {
    if (err) {
      console.log(err)
    } else {
      res.send({msg: req.body.document})
    }
  })
})

module.exports = router
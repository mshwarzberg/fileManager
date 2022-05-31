const express = require("express");
const router = express.Router();
const fs = require("fs");

const { checkIfFileOrDir } = require("../helpers/isfileordirectory");

router.post("/", (req, res) => {
  if (!req.body.path) {
    return res.send({err: 'path is blank'})
  }
    fs.readdir(req.body.path, {withFileTypes: true},(error, files) => {
    if (error) return res.end()
    let dirArray = []
    for (let i in files) {
      if (checkIfFileOrDir(files[i]).isDirectory) {
        dirArray.push(files[i].name)
      }
    }
    res.send({array: dirArray})
  })
});

module.exports = router;

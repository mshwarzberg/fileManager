const express = require("express");
const router = express.Router();
const fs = require("fs");

const { checkIfFileOrDir } = require("./middleware");

router.post("/", (req, res) => {
  fs.readdir(req.body.path, {withFileTypes: true},(error, files) => {
    if (error) console.log(error)
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

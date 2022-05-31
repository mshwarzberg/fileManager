const express = require("express");
const router = express.Router();
const fastFolderSize = require('../helpers/fast-folder-data')

router.post("/", (req, res) => {
  try {
    fastFolderSize(req.body.path, (err, data) => {
      if (err) {
        console.log(err)
      }
      
      res.send(data)
    })
  } catch {
    res.end()
  }
});

module.exports = router;

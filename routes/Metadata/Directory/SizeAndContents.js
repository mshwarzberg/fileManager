const express = require("express");
const router = express.Router();
const fastFolderSize = require("./fast-folder-data");

router.post("/", (req, res) => {
  try {
    fastFolderSize(req.body.path, (err, data) => {
      if (err) {
        res.end();
      }
      data = { ...data, bytes: data.bytes };
      res.send(data);
    });
  } catch (e) {
    console.log(e.stderr.toString());
    res.end();
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const fastFolderSize = require("../filesystemhelpers/fast-folder-data");

router.post("/", (req, res) => {
  try {
    fastFolderSize(req.body.path, (err, data) => {
      if (err) {
        res.end();
      }
      res.send(data);
    });
  } catch {
    res.end();
  }
});

module.exports = router;

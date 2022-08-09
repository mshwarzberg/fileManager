const express = require("express");
const router = express.Router();
const fastFolderSize = require("./fast-folder-data");

router.post("/", (req, res) => {
  const timeout = setTimeout(() => {
    res.end();
  }, 5000);
  try {
    fastFolderSize(req.body.path, (err, data) => {
      clearTimeout(timeout);
      if (err) {
        res.end();
      }
      data = { ...data, bytes: data.bytes };
      timeout.unref();
      res.send(data);
    });
  } catch (e) {
    console.log(e.stderr.toString());
    res.end();
  }
});

module.exports = router;

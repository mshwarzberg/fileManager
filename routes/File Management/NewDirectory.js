const express = require("express");
const router = express.Router();
const fs = require("fs");

router.post("/", (req, res) => {
  try {
    fs.mkdirSync(req.body.path);
  } catch (e) {
    return res.status(405).send({
      err: e.toString(),
    });
  }
  res.end();
});

module.exports = router;

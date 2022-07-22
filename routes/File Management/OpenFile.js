const express = require("express");
const router = express.Router();
const { execSync } = require("child_process");

router.post("/", (req, res) => {
  try {
    execSync(`"${req.body.path}"`);
  } catch (e) {
    console.log(e.toString());
  }
  res.end();
});

module.exports = router;

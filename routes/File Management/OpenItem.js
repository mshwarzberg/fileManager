const express = require("express");
const router = express.Router();
const { exec } = require("child_process");

router.post("/", (req, res) => {
  try {
    exec(`"${req.body.path}" activate`);
  } catch (e) {
    console.log(e.toString());
  }
  res.end();
});

router.post("/withexplorer", (req, res) => {
  let path = req.body.path.replaceAll("/", "\\");
  try {
    exec(`start %windir%/explorer.exe "${path}"`);
  } catch (e) {
    console.log(e.toString());
  }
  res.end();
});
module.exports = router;

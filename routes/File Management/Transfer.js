const express = require("express");
const router = express.Router();
const { execSync } = require("child_process");

router.post("/", (req, res) => {
  let { mode, source, destination, isDirectory } = req.body;
  let transferItem;
  try {
    if (mode === "copy") {
      let completePath = `"${source}" "${destination}"`.replaceAll("/", "\\");
      transferItem = `copy ${completePath}`;
      if (isDirectory) {
        transferItem = `xcopy ${completePath} /s /h /e`;
      }
      execSync(transferItem);
    }
    if (mode === "cut") {
      let completePath = `"${source}" "${destination}"`.replaceAll("/", "\\");
      transferItem = `move ${completePath}`;
      execSync(transferItem);
    }
    return res.end();
  } catch (e) {
    console.log(e.toString());
    return res.status(500).send({ err: e.toString() });
  }
});

module.exports = router;

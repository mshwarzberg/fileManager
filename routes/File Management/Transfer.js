const express = require("express");
const router = express.Router();
const fs = require("fs");
const os = require("os");
const { execSync } = require("child_process");

router.post("/", (req, res) => {
  let { mode, source, destination, isDirectory } = req.body;
  let transferItem;
  try {
    fs.statSync(destination);
    return res.status(409).send({ err: "File already exists with that name" });
  } catch {
    try {
      if (mode === "copy") {
        if (os.platform() === "win32") {
          let completePath = `"${source}" "${destination}"`.replaceAll(
            "/",
            "\\"
          );
          transferItem = `copy ${completePath}`;
          if (isDirectory) {
            transferItem = `xcopy ${completePath}\\ /s /h /e`;
          }
        } else if (os.platform() === "linux") {
          transferItem = `cp "${source}" "${destination}"`;
        }
        execSync(transferItem);
      }
      if (mode === "cut") {
        if (os.platform() === "win32") {
          let completePath = `"${source}" "${destination}"`.replaceAll(
            "/",
            "\\"
          );
          transferItem = `move ${completePath}`;
        }
        execSync(transferItem);
      }
    } catch (e) {
      console.log(e.toString());
      return res.status(500).send({ err: e.toString() });
    }

    res.end();
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execSync } = require("child_process");
const Metadata = require("../../helpers/metadata");

router.post("/", (req, res) => {
  let { mode, path, destination, name, isDirectory } = req.body;
  let transferItem;
  try {
    fs.statSync(destination + "/" + name);
    return res.send({ err: "File already exists with that name" });
  } catch {
    try {
      if (mode === "copy") {
        if (os.platform() === "win32") {
          let completePath = `"${path}" "${
            destination + "/" + name
          }"`.replaceAll("/", "\\");
          transferItem = `copy ${completePath}`;
          if (isDirectory) {
            transferItem = `xcopy ${completePath}\\ /s /h /e`;
          }
        } else if (os.platform() === "linux") {
          transferItem = `cp "${path}" "${destination + "/" + name}"`;
        }
        execSync(transferItem);
      }
      if (mode === "cut") {
        if (os.platform() === "win32") {
          let completePath = `"${path}" "${
            destination + "/" + name
          }"`.replaceAll("/", "\\");
          transferItem = `move ${completePath} `;
        }
        execSync(transferItem);
      }
    } catch (e) {
      console.log(e.toString());
      return res.send({ err: e.toString() });
    }

    const result = fs
      .readdirSync(destination, { withFileTypes: true })
      .map((item) => {
        if (item.name === name) {
          return Metadata(item, destination);
        }
      });

    res.send(result.filter((item) => item && item)[0]);
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const fs = require("fs");

const { checkIfFileOrDir } = require("../../helpers/isfileordirectory");

router.post("/", (req, res) => {
  const { path } = req.body;
  if (!path) {
    return res.send({ err: "path is blank" }).status(404);
  }
  fs.readdir(path, { withFileTypes: true }, (error, files) => {
    if (error) return res.end();
    let dirArray = [];
    for (const item of files) {
      if (checkIfFileOrDir(item).isDirectory) {
        if (
          (item.name === "temp" || item.name === "$RECYCLE.BIN") &&
          path.length === 3
        ) {
          continue;
        }
        let folderName = item.name;
        try {
          fs.statSync(`${path === "/" ? path : path + "/"}${item.name}`);
        } catch {
          folderName = folderName + "*/";
        }
        dirArray.push(folderName);
      }
    }
    res.send(dirArray);
  });
});

module.exports = router;

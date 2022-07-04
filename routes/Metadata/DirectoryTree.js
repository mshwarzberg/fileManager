const express = require("express");
const router = express.Router();
const fs = require("fs");

const { checkIfFileOrDir } = require("../../helpers/isfileordirectory");

router.post("/", (req, res) => {
  if (!req.body.path) {
    return res.send({ err: "path is blank" });
  }
  fs.readdir(req.body.path, { withFileTypes: true }, (error, files) => {
    if (error) return res.end();
    let dirArray = [];
    for (let i in files) {
      if (checkIfFileOrDir(files[i]).isDirectory) {
        let folderName = files[i].name;
        try {
          fs.statSync(
            `${req.body.path === "/" ? req.body.path : req.body.path + "/"}${
              files[i].name
            }`
          );
        } catch {
          folderName = folderName + "*?<>";
        }
        dirArray.push(folderName);
      }
    }
    res.send({ array: dirArray });
  });
});

module.exports = router;

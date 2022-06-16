const express = require("express");
const router = express.Router();
const fastFolderSize = require("../filesystemhelpers/fast-folder-data");
const fs = require("fs");
const { formatSize } = require("../helpers/formatsize");

router.post("/getsize", (req, res) => {
  try {
    fastFolderSize(req.body.path, (err, data) => {
      if (err) {
        res.end();
      }
      data = { ...data, bytes: formatSize(data.bytes) };
      res.send(data);
    });
  } catch (e) {
    console.log(e.stderr.toString());
    res.end();
  }
});

router.post("/", (req, res) => {
  let { path } = req.body;
  let name;
  var {
    birthtimeMs: dateCreated,
    mtimeMs: dateModified,
    atimeMs: dateAccessed,
  } = fs.statSync(path);
  for (let i = path.length; i >= 0; i--) {
    if (path[i] === "/") {
      name = path.slice(i + 1, path.length);
      break;
    }
  }
  res.send({
    name: name || path,
    path: path,
    created: dateCreated,
    modified: dateModified,
    accessed: dateAccessed,
  });
});
module.exports = router;

const express = require("express");
const router = express.Router();
const fs = require("fs");

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

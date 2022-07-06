const express = require("express");
const router = express.Router();
const fs = require("fs");

router.post("/", (req, res) => {
  let { path, name } = req.body;

  var {
    birthtimeMs: dateCreated,
    mtimeMs: dateModified,
    atimeMs: dateAccessed,
  } = fs.statSync(path);
  for (let i = path.length - 2; i >= 0; i--) {
    if (path[i] === "/" && !name) {
      name = path.slice(i + 1, path.length - 1);
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

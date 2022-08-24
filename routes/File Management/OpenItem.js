const express = require("express");
const router = express.Router();
const { exec } = require("child_process");

router.post("/", (req, res) => {
  let path = req.body.path.split("");
  for (let i in path) {
    if (path[i] === "/") {
      path.splice(i, 1, '"/"');
    }
    if (path[i - 1] === ":") {
      path.splice(i, 1, '/"');
    }
  }
  try {
    exec(`cmd /c "start ${path.join("")}""`);
  } catch (e) {
    return res.send({ err: e.toString() });
  }
  res.send({});
});

router.post("/withexplorer", (req, res) => {
  let path = req.body.path.replaceAll("/", "\\");
  const { isFile } = req.body;
  try {
    exec(`explorer.exe ${isFile ? `/select, ${path}` : path}`);
  } catch (e) {
    console.log(e.toString());
  }
  res.end();
});
module.exports = router;

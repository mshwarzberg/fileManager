const express = require("express");
const router = express.Router();
const fs = require("fs");

process.on("uncaughtException", function (err) {
  console.error(err);
});

function copyDir(srcPath, srcName, destination, isSrcNameDirectory) {
  if (isSrcNameDirectory) {
    fs.mkdirSync(destination + srcName, { recursive: true });
    const items = fs.readdirSync(srcPath + srcName, { withFileTypes: true });
    for (const item of items) {
      if (item.isDirectory()) {
        copyDir(srcPath + srcName, item.name, destination, true);
      } else {
        fs.copyFileSync(
          `${srcPath}${srcName}/${item.name}`,
          `${destination}${srcName}/${item.name}`
        );
      }
    }
  } else {
    fs.copyFileSync(srcPath + srcName, destination + srcName);
  }
  return;
}

router.post("/", (req, res) => {
  const { mode, source, destination } = req.body;
  if (source.path === destination) {
    return res
      .send({ err: "destination cannot be same as source" })
      .status(409);
  }
  if (mode === "copy") {
    copyDir(source.path, source.name, destination, source.isDirectory);
  } else {
    fs.renameSync(source.path + source.name, destination + "/" + source.name);
  }

  return res.send({ msg: "successfully transferred" });
});

module.exports = router;

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

router.post("/checkfordupes", (req, res) => {
  const destinationFiles = fs.readdirSync(req.body.destination);
  const duplicates = req.body.names
    .map((name) => {
      if (destinationFiles.includes(name)) {
        return name;
      }
    })
    .filter((item) => item && item);
  return res.send({ duplicates: duplicates });
});

router.post("/", (req, res) => {
  const { mode, source, destination } = req.body;
  if (mode === "copy") {
    copyDir(source.path, source.name, destination, source.isDirectory);
  } else {
    fs.renameSync(source.path + source.name, destination + "/" + source.name);
  }

  return res.send({ msg: "successfully transferred" });
});

module.exports = router;

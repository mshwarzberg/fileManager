const express = require("express");
const router = express.Router();
const fs = require("fs");
const { execSync } = require("child_process");
const { checkType } = require("../../helpers/verifiers");

router.post("/", (req, res) => {
  const { path } = req.body;
  if (!path) {
    return res.send({ err: "path is blank" }).status(404);
  }

  fs.readdir(path + "/", { withFileTypes: true }, (error, files) => {
    if (error) return res.end();
    let dirArray = [];
    for (const item of files) {
      if (
        (item.name === "temp" ||
          item.name === "$RECYCLE.BIN" ||
          item.name === "System Volume Information") &&
        path.length === 2
      ) {
        continue;
      }
      let permission = true;
      try {
        fs.statSync(`${path}/${item.name}`);
      } catch {
        permission = false;
      }
      let symLink;
      if (item.isSymbolicLink()) {
        symLink = fs.readlinkSync(path + "/" + item.name);
        symLink = symLink.replaceAll("\\", "/");
      }

      dirArray.push({
        path: path + "/" + item.name,
        name: item.name,
        itemtype: checkType(item.name)[0],
        permission: permission,
        isFile: item.isFile(),
        isDirectory: item.isDirectory(),
        isSymbolicLink: item.isSymbolicLink(),
        collapsed: true,
        ...(item.isSymbolicLink() && { linkTo: symLink }),
      });
    }
    res.send(dirArray);
  });
});

router.get("/initialtree", (_, res) => {
  let listOfDrives = execSync(
    "wmic logicaldisk get name, size /format:Textvaluelist"
  );
  const username = execSync("echo %username%").toString().split("\r")[0];
  listOfDrives = listOfDrives.toString().split("\r\r");
  let defaultTree = [];
  for (let i of listOfDrives) {
    if (i.includes("Name")) {
      defaultTree.push({
        name: i.split("=")[1],
        path: i.split("=")[1],
        permission: true,
        collapsed: true,
        size: listOfDrives[listOfDrives.indexOf(i) + 1].split("=")[1],
        type: "drive",
      });
    }
  }
  if (username) {
    const directories = [
      "Videos",
      "Pictures",
      "Music",
      "Downloads",
      "Documents",
      "Desktop",
    ];
    for (let directory of directories) {
      defaultTree.unshift({
        name: directory,
        path: `C:/Users/${username}/${directory}`,
        permission: true,
        type: "default",
        isDirectory: true,
        collapsed: true,
      });
    }
  }
  res.send(defaultTree);
});

module.exports = router;

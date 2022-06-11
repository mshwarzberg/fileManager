const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

router.post("/rename", (req, res) => {
  let {
    drive,
    path: oldpath,
    oldname,
    newname,
    updatethumb,
    oldthumbname,
    newthumbname,
  } = req.body;

  let newpath;
  for (let i = oldpath.length; i >= 0; i--) {
    if (oldpath[i] === "/") {
      newpath = oldpath.slice(0, i + 1) + newname;
      break;
    }
  }

  try {
    if (fs.statSync(newpath)) {
      return res.send({ err: "File already exists with that name" });
    }
  } catch (e) {
    try {
      fs.renameSync(oldpath, newpath);
      if (updatethumb) {
        oldpath =
          drive +
          "thumbnails/" +
          oldpath.slice(drive.length, oldpath.length - oldname.length) +
          oldthumbname;
        newpath =
          drive +
          "thumbnails/" +
          newpath.slice(drive.length, newpath.length - oldname.length) +
          newthumbname;
        fs.renameSync(oldpath, newpath);
      }
      return res.send({ msg: "successfully renamed" });
    } catch (e) {
      console.log(e.toString());
      return res.send({ err: "cannot change name" });
    }
  }
});

router.post("/delete", (req, res) => {
  const setPermission =
    "powershell.exe Set-ExecutionPolicy -Scope CurrentUser remoteSigned";
  const deleteItem = `powershell.exe -f ${path.join(
    __dirname,
    "../filesystemhelpers/Recycle.ps1"
  )} "${req.body.path}"`;
  try {
    execSync(setPermission);
    execSync(deleteItem, { stdio: "pipe" });
  } catch (e) {
    console.log(e.toString());
  }
  res.end();
});
module.exports = router;

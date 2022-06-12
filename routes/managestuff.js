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
    renameInThumbDirectory,
    oldthumbname,
    newthumbname,
    isdirectory,
  } = req.body;

  let newpath;
  for (let i = oldpath.length; i >= 0; i--) {
    if (oldpath[i] === "/") {
      newpath = oldpath.slice(0, i + 1) + newname;
      break;
    }
  }
  try {
    fs.statSync(newpath);
    return res.send({ err: "File already exists with that name" });
  } catch (e) {
    try {
      // rename things that don't need to be updated in the thumbnail directory
      fs.renameSync(oldpath, newpath);
      if (renameInThumbDirectory) {
        // if item is a directory or an item that has a thumbnail (gif, image or video)
        if (!isdirectory) {
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
          // rename directories in the thumbnail folder
        } else {
          oldpath =
            drive +
            "thumbnails/" +
            oldpath.slice(drive.length, oldpath.length - oldname.length) +
            oldname;
          newpath =
            drive +
            "thumbnails/" +
            newpath.slice(drive.length, newpath.length - newname.length) +
            newname;
        }
        fs.renameSync(oldpath, newpath);
      }
      return res.send({ msg: "successfully renamed" });
    } catch (e) {
      console.log("managestuff rename", e.toString());
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
    const output = execSync(deleteItem, { stdio: "pipe" }).toString();
    if (output.trim() === "Error") {
      return res.send({ err: output.trim() });
    }
  } catch (e) {
    return res.send({ err: e.toString() });
  }
  res.end();
});
module.exports = router;

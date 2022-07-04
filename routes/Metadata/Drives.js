const child = require("child_process");
const os = require("os");
const express = require("express");
const router = express.Router();

router.get("/", (_, res) => {
  let drives;
  let sortedDrives = [];
  if (os.platform() === "win32") {
    drives = child.execSync("wmic logicaldisk get name");
    let listOfDrives = drives.toString().split("\r\r\n");
    for (let i in listOfDrives) {
      if (listOfDrives[i].includes(":")) {
        sortedDrives.push({
          name: listOfDrives[i].trim() + "/",
          permission: true,
          isDrive: true,
        });
      }
    }
  } else if (os.platform() === "linux") {
    drives = child.execSync("df");
    drives = drives.toString().split("\n");
    drives = drives
      .map((drive) => {
        if (!drive.includes("/dev/")) {
          return "";
        }
        return drive;
      })
      .filter((entry) => /\S/.test(entry));
    for (let i in drives) {
      drives[i] = drives[i].split("%")[1].trim();
      if (drives[i].includes("/media") || drives[i] === "/") {
        sortedDrives.push({ name: drives[i], permission: true, isDrive: true });
      }
    }
  }
  res.send(sortedDrives);
});

module.exports = router;

const child = require("child_process");
const express = require("express");
const router = express.Router();

router.get("/", (_, res) => {
  let sortedDrives = [];
  let drives = child.execSync(
    "wmic logicaldisk get caption,drivetype, size, freespace /format:Textvaluelist"
  );

  drives = drives.toString().split("\n");
  for (let i in drives) {
    if (drives[i].startsWith("Caption")) {
      sortedDrives.push({
        name: `(${drives[i].split("=")[1].split("\r\r")[0]})`,
        isNetworkDrive: parseInt(drives[i * 1 + 1].split("=")[1]) === 4,
        totalSize: parseInt(drives[i * 1 + 3].split("=")[1]),
        availableSpace: parseInt(drives[i * 1 + 2].split("=")[1]),
        permission: true,
        isDrive: true,
        path: drives[i].split("=")[1].split("\r\r")[0] + "/",
      });
    }
  }
  res.send(sortedDrives);
});

module.exports = router;

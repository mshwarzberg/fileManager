const child = require("child_process");
const express = require("express");
const router = express.Router();

router.get("/", (_, res) => {
  let sortedDrives = [];
  let test = child.execSync(
    "wmic logicaldisk get caption,drivetype, size /format:Textvaluelist"
  );
  test = test.toString().split("\n");
  for (let i in test) {
    if (test[i].startsWith("Caption")) {
      sortedDrives.push({
        name: test[i].split("=")[1].split("\r\r")[0] + "/",
        isNetworkDrive: parseInt(test[i * 1 + 1].split("=")[1]) === 4,
        size: parseInt(test[i * 1 + 2].split("=")[1]),
        permission: true,
        isDrive: true,
        path: test[i].split("=")[1].split("\r\r")[0] + "/",
      });
    }
  }
  res.send(sortedDrives);
});

module.exports = router;

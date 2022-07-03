const express = require("express");
const fs = require("fs");
const router = express.Router();
const child = require("child_process");
const os = require("os");

const { getFileNameParts } = require("../helpers/getfileparts");
const { verifyFolder, checkType } = require("../helpers/verifiers");
const { makeThumbnails } = require("../middleware/makethumbnails");
const {
  makeThumbnailDirectories,
} = require("../middleware/makethumbnaildirectories");
const { ffprobeMetadata } = require("../helpers/ffmpegfunctions");

router.get("/choosedrive", (_, res) => {
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

router.post("/data", verifyFolder, makeThumbnailDirectories, (req, res) => {
  const { currentdirectory, drive } = req.body;
  // generate all the file in the current folder
  var result = fs
    .readdirSync(`${currentdirectory}`, { withFileTypes: true })
    .map((file) => {
      return getFileNameParts(file, currentdirectory, drive);
    });
  res.send(result);
});

router.post("/thumbs", verifyFolder, makeThumbnails, (req, res) => {
  const { currentdirectory, suffix, drive } = req.body;
  const prefix = decodeURIComponent(req.body.prefix);

  let restOfPath = currentdirectory.slice(
    drive.length,
    currentdirectory.length
  );

  const isImageGifVideo = [
    checkType(suffix) === "video",
    checkType(suffix) === "gif",
    checkType(suffix) === "image",
  ];

  if (isImageGifVideo.includes(true)) {
    ffprobeMetadata(`${currentdirectory}/${prefix}.${suffix}`, (data) => {
      fs.readdir(`${drive}/temp/${restOfPath}`, (err, files) => {
        if (err) return res.send({ err: err }).status(404);
        if (files && files.indexOf(`${prefix}${suffix}.jpeg`) !== -1) {
          const options = {
            root: drive,
            headers: {
              prefix: encodeURIComponent(prefix),
              suffix: suffix,
              width: data.width || "",
              height: data.height || "",
              ...(data.duration > 0.05 && {
                duration: data.duration,
              }),
            },
          };
          return res.sendFile(
            `/temp/${restOfPath}/${prefix}${suffix}.jpeg`,
            options
          );
        } else {
          return res.end();
        }
      });
    });
  } else {
    res.end();
  }
});

module.exports = router;

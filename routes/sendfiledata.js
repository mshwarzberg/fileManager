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

router.get("/choosedrive", (req, res) => {
  let drives;
  let sortedDrives = [];
  if (os.platform() === "win32") {
    drives = child.execSync("wmic logicaldisk get name");
    let test = drives.toString().split("\r\r\n");
    for (let i in test) {
      if (test[i].includes(":")) {
        sortedDrives.push(test[i].trim() + "/");
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
        sortedDrives.push(drives[i]);
      }
    }
  }
  res.send(sortedDrives);
});

router.post("/data", verifyFolder, makeThumbnailDirectories, (req, res) => {
  let { currentdirectory } = req.body;
  // generate all the file in the current folder
  var result = fs
    .readdirSync(`${currentdirectory}`, { withFileTypes: true })
    .map((file) => {
      return getFileNameParts(file, currentdirectory);
    });
  res.send(result);
});

router.post("/thumbs", verifyFolder, makeThumbnails, (req, res) => {
  const { currentdirectory, suffix, drive } = req.body;
  let restOfPath = currentdirectory.slice(
    drive.length,
    currentdirectory.length
  );

  const prefix = decodeURIComponent(req.body.prefix);
  const isImageGifVideo = [
    checkType(suffix) === "video",
    checkType(suffix) === "gif",
    checkType(suffix) === "image",
  ];

  if (isImageGifVideo.includes(true)) {
    ffprobeMetadata(`${currentdirectory}/${prefix}.${suffix}`, (data) => {
      fs.readdir(`${drive}/thumbnails/${restOfPath}`, (_, files) => {
        if (
          files &&
          files.indexOf(`thumbnail-${prefix}${suffix}.jpeg`) !== -1
        ) {
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
            `/thumbnails/${restOfPath}/thumbnail-${prefix}${suffix}.jpeg`,
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

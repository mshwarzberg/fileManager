const express = require("express");
const fs = require("fs");
const router = express.Router();
const ffmpeg = require("fluent-ffmpeg");
const child = require("child_process");
const os = require('node:os')

const { getFileNameParts } = require("../helpers/getfileparts");
const { verifyFolder } = require("../helpers/verifiers");
const { makeThumbnails } = require("../middleware/makethumbnails");
const {
  makeThumbnailDirectories,
} = require("../middleware/makethumbnaildirectories");

router.get("/choosedrive", (req, res) => {
  let drives = child.execSync("wmic logicaldisk get name");
  let sortedDrives = []
  let test = drives.toString().split("\r\r\n")
  for (let i in test) {
    if (test[i].includes(':'))  {
      sortedDrives.push(test[i].trim() + '/')
    }
  }
  console.log(os.platform())
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
  const { currentdirectory, suffix } = req.body;
  let root = currentdirectory.slice(0, 2)
  let restOfPath = currentdirectory.slice(3, currentdirectory.length)
  
  const prefix = decodeURIComponent(req.body.prefix);
  ffmpeg.ffprobe(`${currentdirectory}/${prefix}.${suffix}`, (_, data) => {
    fs.readdir(`${root}/thumbnails/${restOfPath}`, (err, files) => {
      if (err) {
        return res.end()
      }
      if (files?.indexOf(`thumbnail-${prefix}${suffix}.jpeg`) !== -1) {
        const options = {
          root: '',
          headers: {
            prefix: encodeURIComponent(prefix),
            suffix: suffix,
            width: data.streams[0].width || data.streams[1].width || "",
            height: data.streams[0].height || data.streams[1].height || "",
            ...(data.format.duration !== "N/A" && {
              duration: data.format.duration || "",
            }),
          },
        };
        return res.sendFile(
          `${root}/thumbnails/${restOfPath}/thumbnail-${prefix}${suffix}.jpeg`,
          options
        );
      } else {
        res.end();
      }
    });
  });
});

module.exports = router;

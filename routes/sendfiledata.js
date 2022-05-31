const express = require("express");
const fs = require("fs");
const router = express.Router();
const ffmpeg = require("fluent-ffmpeg");

const { getFileNameParts } = require("../helpers/getfileparts");
const { verifyFolder } = require("../helpers/verifiers");
const { makeThumbnails } = require("../middleware/makethumbnails");
const {
  makeThumbnailDirectories,
} = require("../middleware/makethumbnaildirectories");

router.post("/thumbs", verifyFolder, makeThumbnails, (req, res) => {
  const { currentdirectory, suffix } = req.body;

  const prefix = decodeURIComponent(req.body.prefix);
  ffmpeg.ffprobe(`${currentdirectory}/${prefix}.${suffix}`, (_, data) => {
    fs.readdir(`./thumbnails/${currentdirectory}`, (err, files) => {
      if (err) console.log('ffmpeg error');
      if (files?.indexOf(`thumbnail-${prefix}${suffix}.jpeg`) !== -1) {
        
        const options = {
          root: "./",
          headers: {
            prefix: encodeURIComponent(prefix),
            suffix: suffix,
            width: data.streams[0].width || data.streams[1].width || '',
            height: data.streams[0].height || data.streams[1].height || '',
            ...(data.format.duration !== "N/A" && {
              duration: data.format.duration || '',
            }),
          },
        };
        return res.sendFile(
          `/thumbnails/${currentdirectory}/thumbnail-${prefix}${suffix}.jpeg`,
          options
        );
      } else {
        res.end();
      }
    });
  });
});

router.post("/data", verifyFolder, makeThumbnailDirectories, (req, res) => {
  const { currentdirectory } = req.body;
  // generate all the file in the current folder
  var result = fs
    .readdirSync(`${currentdirectory}`, { withFileTypes: true })
    .map((file) => {
      return getFileNameParts(file, currentdirectory);
    });
  res.send(result);
});

module.exports = router;

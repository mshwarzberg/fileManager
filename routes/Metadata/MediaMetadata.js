const express = require("express");
const router = express.Router();
const fs = require("fs");
const { ffprobeMetadata } = require("../../helpers/ffmpegfunctions");
const { makeThumbnails } = require("../../middleware/makethumbnails");
const { verifyFolder, checkType } = require("../../helpers/verifiers");

router.post("/", verifyFolder, makeThumbnails, (req, res) => {
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
        if (err) return res.send({ err: err }).status(500);
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

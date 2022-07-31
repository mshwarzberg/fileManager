const fs = require("fs");
const sharp = require("sharp");
const { ffmpegThumbs } = require("./ffmpegfunctions");
const { checkType } = require("./verifiers");

function makeThumbs(drive, currentdirectory, prefix, fileextension) {
  const restOfPath = currentdirectory.slice(
    drive.length,
    currentdirectory.length
  );
  // before generating thumbnail check if it already exists
  fs.readdir(`${drive}/temp/${restOfPath}`, (err, files) => {
    if (err) return console.log("makethumbs", err);
    if (files && files.indexOf(`${prefix}${fileextension}.jpeg`) === -1) {
      // generate thumbnails for videos and gifs
      if (
        checkType(fileextension) === "video" ||
        checkType(fileextension) === "gif"
      ) {
        ffmpegThumbs(
          `${currentdirectory}/${prefix}.${fileextension}`,
          `${drive}/temp/${restOfPath}/${prefix}${fileextension}.jpeg`,
          () => {}
        );
      }
      // generate thumbnails for images
      else if (checkType(fileextension) === "image") {
        sharp(`${currentdirectory}/${prefix}.${fileextension}`)
          .resize({ width: 400 })
          .toFile(`${drive}/temp/${restOfPath}/${prefix}${fileextension}.jpeg`)
          .catch((e) => {
            return console.log("sharp err", prefix + "." + fileextension);
          });
      }
    }
  });
}

module.exports = { makeThumbs };

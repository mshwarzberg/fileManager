const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const sharp = require("sharp");

const { checkType } = require("../helpers/verifiers");

function makeThumbnails(req, res, next) {
  const { currentdirectory, suffix, drive } = req.body;
  const prefix = decodeURIComponent(req.body.prefix);
  let restOfPath = currentdirectory.slice(
    drive.length,
    currentdirectory.length
  );

  const makeThumbs = new Promise((resolve, reject) => {
    // before generating thumbnail check if it already exists
    fs.readdir(`${drive}/thumbnails`, (err, files) => {
      if (err) reject("readdir err");
      if (files && files.indexOf(`thumbnail-${prefix}${suffix}.jpeg`) === -1) {
        // generate thumbnails for videos and gifs
        if (checkType(suffix) === "video" || checkType(suffix) === "gif") {
          ffmpeg(`${currentdirectory}/${prefix}.${suffix}`)
            .thumbnails({
              count: 1,
              folder: `${drive}/thumbnails/${restOfPath}`,
              timestamps: ["81%"],
              filename: `thumbnail-${prefix}${suffix}.jpeg`,
            })
            .on("end", () => {
              return resolve();
            })
            .on("error", (e) => {
              return reject("ffmpeg err", prefix + suffix);
            });
        }
        // generate thumbnails for images
        else if (checkType(suffix) === "image") {
          sharp(`${currentdirectory}/${prefix}.${suffix}`)
            .resize({ width: 400 })
            .toFile(
              `${drive}/thumbnails/${restOfPath}/thumbnail-${prefix}${suffix}.jpeg`
            )
            .then(() => {
              return resolve();
            })
            .catch(() => {
              return reject("sharp err", prefix + suffix);
            });
        }
      }
      resolve();
    });
  });

  return makeThumbs.then(next()).catch((e) => {
    return res.end();
  });
}

module.exports = { makeThumbnails };

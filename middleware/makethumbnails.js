const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const sharp = require("sharp");

const { checkType } = require("../helpers/verifiers");

function makeThumbnails(req, res, next) {
  const { currentdirectory, suffix } = req.body;
  const prefix = decodeURIComponent(req.body.prefix);
  let root = currentdirectory.slice(0, 2)
  let restOfPath = currentdirectory.slice(3, currentdirectory.length)

  const makeThumbs = new Promise((resolve, reject) => {
    // before generating thumbnail check if it already exists
    fs.readdir(`${root}/thumbnails`, (err, files) => {
      if (err) reject("readdir err");
      if (files?.indexOf(`thumbnail-${prefix}${suffix}.jpeg`) === -1) {
        // generate thumbnails for videos and gifs
        if (checkType(suffix) === "video" || checkType(suffix) === "gif") {
          ffmpeg(`${currentdirectory}/${prefix}.${suffix}`)
            .thumbnails({
              count: 1,
              folder: `${root}/thumbnails/${restOfPath}`,
              timestamps: ["70%"],
              filename: `thumbnail-${prefix}${suffix}.jpeg`,
            })
            .on("end", () => {
              resolve();
            })
            .on("error", (e) => {
              reject("ffmpeg err");
            });
        }
        // generate thumbnails for images
        else if (checkType(suffix) === "image" && suffix !== "xcf") {
          sharp(`${currentdirectory}/${prefix}.${suffix}`)
            .resize({ width: 400 })
            .toFile(
              `${root}/thumbnails/${restOfPath}/thumbnail-${prefix}${suffix}.jpeg`
            )
            .then(() => {
              resolve();
            })
            .catch(() => {
              reject("sharp err");
            });
        }
      }
    });
  });

  makeThumbs.then(next()).catch(() => {
    res.end();
  });
}

module.exports = { makeThumbnails };

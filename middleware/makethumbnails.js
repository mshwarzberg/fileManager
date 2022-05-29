const fs = require('fs')
const ffmpeg = require("fluent-ffmpeg");
const sharp = require("sharp");

const {checkType} = require('../helpers/verifiers')

function makeThumbnails(req, res, next) {
  const { currentdirectory, suffix } = req.body;
  const prefix = decodeURIComponent(req.body.prefix);
  const makeThumbs = new Promise((resolve, reject) => {
    // before generating thumbnail check if it already exists
    fs.readdir(`./thumbnails/${currentdirectory}`, (err, files) => {
      if (err) reject();
      if (files?.indexOf(`thumbnail-${prefix}${suffix}.jpeg`) === -1) {
        // generate thumbnails for videos and gifs
        if (checkType(suffix) === "video" || checkType(suffix) === "gif") {
          ffmpeg(`${currentdirectory}/${prefix}.${suffix}`)
            .thumbnails({
              count: 1,
              folder: `./thumbnails/${currentdirectory}`,
              timestamps: ["70%"],
              filename: `thumbnail-${prefix}${suffix}.jpeg`,
            })
            .on("end", () => {
              resolve();
            })
            .on("error", () => {
              reject();
            });
        }
        // generate thumbnails for images
        else if (checkType(suffix) === "image" && suffix !== "xcf") {
          sharp(`${currentdirectory}/${prefix}.${suffix}`)
            .resize({ width: 400 })
            .toFile(
              `./thumbnails/${currentdirectory}/thumbnail-${prefix}${suffix}.jpeg`
            )
            .then((res) => {
              resolve();
            })
            .catch((err) => {
              reject();
            });
        }
      }
    });
  });

  makeThumbs.then(next()).catch((err) => {
    res.end();
  });
}

module.exports = { makeThumbnails }
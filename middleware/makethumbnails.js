const fs = require("fs");
const sharp = require("sharp");
const { ffmpegThumbs } = require("../helpers/ffmpegfunctions");
const { checkType } = require("../helpers/verifiers");

let array = [];
function makeThumbnails(req, res, next) {
  const { currentdirectory, suffix, drive } = req.body;
  const prefix = decodeURIComponent(req.body.prefix);
  let restOfPath = currentdirectory.slice(
    drive.length,
    currentdirectory.length
  );

  const makeThumbs = new Promise((resolve, reject) => {
    // before generating thumbnail check if it already exists
    fs.readdir(`${drive}/thumbnails/${restOfPath}`, (err, files) => {
      if (err) reject("readdir err");
      if (files && files.indexOf(`${prefix}${suffix}.jpeg`) === -1) {
        // generate thumbnails for videos and gifs
        if (checkType(suffix) === "video" || checkType(suffix) === "gif") {
          const start = performance.now();
          ffmpegThumbs(
            `${currentdirectory}/${prefix}.${suffix}`,
            `${drive}/thumbnails/${restOfPath}/${prefix}${suffix}.jpeg`,
            () => {
              resolve();
            }
          );
          const end = performance.now();
          array.push(end - start);
        }
        // generate thumbnails for images
        else if (checkType(suffix) === "image") {
          sharp(`${currentdirectory}/${prefix}.${suffix}`)
            .resize({ width: 400 })
            .toFile(`${drive}/thumbnails/${restOfPath}/${prefix}${suffix}.jpeg`)
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
  // let totalTime = 0;
  // for (let i in array) {
  //   totalTime += array[i];
  // }
  // if (!isNaN(totalTime / array.length)) {
  //   console.log((totalTime / array.length).toString().slice(0, 5) + "ms");
  // }
  return makeThumbs.then(next()).catch((e) => {
    return res.end();
  });
}

module.exports = { makeThumbnails };

const fs = require("fs");
const sharp = require("sharp");
const { ffmpegThumbs } = require("./ffmpegfunctions");
const { checkType } = require("./verifiers");

const makeThumbs = (drive, currentdirectory, prefix, fileextension) => {
  return new Promise((resolve, reject) => {
    const restOfPath = currentdirectory.slice(
      drive.length,
      currentdirectory.length
    );
    fs.mkdir(`${drive}/temp/${restOfPath}`, { recursive: true }, (err) => {
      if (err) reject(err);
      resolve();
      fs.readdir(`${drive}/temp/${restOfPath}`, (err, files) => {
        if (err) return console.log("makethumbs", err);
        if (files && files.indexOf(`${prefix}${fileextension}.jpeg`) === -1) {
          if (
            checkType(`${prefix}.${fileextension}`)[0] === "video" ||
            checkType(`${prefix}.${fileextension}`)[0] === "gif"
          ) {
            ffmpegThumbs(
              `${currentdirectory}/${prefix}.${fileextension}`,
              `${drive}/temp/${restOfPath}/${prefix}${fileextension}.jpeg`,
              () => {}
            );
            resolve();
          } else if (checkType(`${prefix}.${fileextension}`)[0] === "image") {
            sharp(`${currentdirectory}/${prefix}.${fileextension}`)
              .resize({ width: 400 })
              .toFile(
                `${drive}/temp/${restOfPath}/${prefix}${fileextension}.jpeg`
              )
              .then(() => {
                resolve();
              })
              .catch((e) => {
                return reject("sharp err", prefix + "." + fileextension);
              });
          } else {
            resolve();
          }
        } else {
          resolve();
        }
      });
    });
  });
};

module.exports = { makeThumbs };

import CheckType from "../../../Helpers/FS and OS Helpers/CheckType";
import { ffmpegThumbs } from "../../../Helpers/FS and OS Helpers/FFmpegFunctions";
const sharp = window.require("sharp");
const fs = window.require("fs");

export default function generateThumbnails(currentDirectory, drive) {
  fs.readdir(currentDirectory, { withFileTypes: true }, (err, files) => {
    if (err) return console.log(err);
    if (files) {
      const restOfPath = currentDirectory.slice(
        drive.length,
        currentDirectory.length
      );
      for (const file of files) {
        try {
          const { size } = fs.statSync(currentDirectory + file.name);
          if (size > 300000) {
            fs.mkdir(
              `${drive}/temp/${restOfPath}/`,
              {
                recursive: true,
              },
              (err) => {
                if (!err) {
                  for (let i = file.name.length - 1; i > 0; i--) {
                    if (file.name[i] === ".") {
                      const fileextension = file.name.slice(i + 1, Infinity);
                      const prefix = file.name.slice(0, i);
                      makeThumbs(
                        drive,
                        currentDirectory,
                        prefix,
                        fileextension
                      );
                      break;
                    }
                  }
                }
              }
            );
          }
        } catch (e) {
          return console.log(e);
        }
      }
    }
  });
}

function makeThumbs(drive, currentdirectory, prefix, fileextension) {
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
            CheckType(`${prefix}.${fileextension}`)[0] === "video" ||
            CheckType(`${prefix}.${fileextension}`)[0] === "gif"
          ) {
            ffmpegThumbs(
              `${currentdirectory}/${prefix}.${fileextension}`,
              `${drive}/temp/${restOfPath}/${prefix}${fileextension}.jpeg`,
              () => {}
            );
            resolve();
          } else if (CheckType(`${prefix}.${fileextension}`)[0] === "image") {
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
}

import checkFileType from "../../Helpers/FS and OS/CheckFileType";
import { ffmpegThumbs } from "../../Helpers/FS and OS/FFmpegFunctions";

const fs = window.require("fs");
const sharp = window.require("sharp");

export default function generateThumbnails(
  drive,
  currentdirectory,
  prefix,
  fileextension
) {
  const restOfPath = currentdirectory.slice(
    drive.length,
    currentdirectory.length
  );
  fs.mkdir(`${drive}/temp/${restOfPath}`, { recursive: true }, (err) => {
    if (err) console.log(err);
    fs.readdir(`${drive}/temp/${restOfPath}`, (err, files) => {
      if (err) return console.log(err);
      if (files && files.indexOf(`${prefix}${fileextension}.jpeg`) === -1) {
        if (
          checkFileType(`${prefix}.${fileextension}`)[0] === "video" ||
          checkFileType(`${prefix}.${fileextension}`)[0] === "gif"
        ) {
          ffmpegThumbs(
            `${currentdirectory}${prefix}.${fileextension}`,
            `${drive}/temp/${restOfPath}${prefix}${fileextension}.jpeg`
          );
        } else if (checkFileType(`${prefix}.${fileextension}`)[0] === "image") {
          sharp(`${currentdirectory}${prefix}.${fileextension}`)
            .resize({ width: 400 })
            .toFile(`${drive}/temp/${restOfPath}${prefix}${fileextension}.jpeg`)
            .catch((e) => {
              console.log(e);
            });
        }
      }
    });
  });
}

const express = require("express");
const fs = require("fs");
const router = express.Router();
const ffmpeg = require("fluent-ffmpeg");
const sharp = require("sharp");

const { verifyFolder, checkType, checkIfFileOrDir } = require("./middleware");

function makeThumbnails(req, res, next) {
  const { currentdirectory, suffix } = req.body;
  const prefix = decodeURIComponent(req.body.prefix);
  const makeThumbs = new Promise((resolve, reject) => {
    // before generating thumbnail check if it already exists
    fs.readdir(`./thumbnails/${currentdirectory}`, (err, files) => {
      if (err) reject()
      if (files.indexOf(`thumbnail-${prefix}${suffix}.jpeg`) === -1) {
        // generate thumbnails for videos and gifs
        if (checkType(suffix) === "video" || checkType(suffix) === "gif") {
          ffmpeg(`./${currentdirectory}/${prefix}.${suffix}`)
            .thumbnails({
              count: 1,
              folder: `./thumbnails/${currentdirectory}`,
              timestamps: ["70%"],
              filename: `thumbnail-${prefix}${suffix}.jpeg`,
            })
            .on("end", () => {
              resolve()
            })
            .on("error", () => {
              reject()
            });
        }
        // generate thumbnails for images
        else if (checkType(suffix) === "image" && suffix !== "xcf") {
          sharp(`./${currentdirectory}/${prefix}.${suffix}`)
            .resize({ width: 400 })
            .toFile(
              `./thumbnails/${currentdirectory}/thumbnail-${prefix}${suffix}.jpeg`
            )
            .then((res) => {
              resolve()
            })
            .catch((err) => {
              reject()
            });
        }
      }
    });
  });
  
  makeThumbs.then(next()).catch(err => {
    res.end()
  })
}

router.post("/thumbs", verifyFolder, makeThumbnails, (req, res) => {
  const { currentdirectory, suffix } = req.body;
  const prefix = decodeURIComponent(req.body.prefix);
  fs.readdir(`./thumbnails/${currentdirectory}`, (err, files) => {
    if (err) console.log(err);
    if (files.indexOf(`thumbnail-${prefix}${suffix}.jpeg`) !== -1) {
      const options = {
        root: "./",
        headers: {
          prefix: encodeURIComponent(prefix),
          suffix: suffix,
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

// when a user enters a new folder create all the subdirectories for the thumbnails.
function makeThumbnailDirectories(req, res, next) {
  const { currentdirectory } = req.body;
  // create folder of the current directory within the thumbnails folder to store the thumbnails

  const makeDirectories = new Promise((resolve, reject) => {
    fs.mkdir(`./thumbnails/${currentdirectory}`, { recursive: true }, () => {
      fs.readdir(
        `./${currentdirectory}`,
        { withFileTypes: true },
        (err, files) => {
          if (err) {
            console.log("cant make dir", err);
            reject();
          }
          for (let i = 0; i < files.length - 1; i++) {
            if (checkIfFileOrDir(files[i]).isDirectory) {
              fs.mkdir(
                `./thumbnails/${currentdirectory}/${files[i].name}`,
                () => {
                  resolve();
                }
              );
            }
          }
        }
      );
    });
  });

  makeDirectories.then(next()).catch((err) => {
    console.log("promise error");
  });
}

router.post("/data", verifyFolder, makeThumbnailDirectories, (req, res) => {
  const { currentdirectory } = req.body;
  // generate all the file in the current folder
  var result = fs
    .readdirSync(`./${currentdirectory}`, { withFileTypes: true })
    .map((file) => {
      let suffix = "";

      const item = checkIfFileOrDir(file);

      // get the file extension
      if (!item.isDirectory) {
        for (let i = file.name.length - 1; i > 0; i--) {
          if (file.name[i] !== "." && suffix === "") {
            suffix = file.name[i];
          } else if (file.name[i] !== ".") {
            suffix = file.name[i] + suffix;
          } else {
            break;
          }
        }
      }
      // get the filename without the extension
      let prefix = "";
      // if the item is a folder don't remove anything. keep the file as is.
      for (
        let j = 0;
        j < file.name.length - (suffix.length && suffix.length + 1);
        j++
      ) {
        if (prefix === "") {
          prefix = file.name[j];
        } else {
          prefix += file.name[j];
        }
      }

      const filteredData = {
        ...item,
        itemtype: item.isDirectory ? "folder" : checkType(suffix),
        fileextension: suffix || "Directory",
        prefix: encodeURIComponent(prefix),
        size: fs.statSync(`${currentdirectory}/${file.name}`).size,
      };

      return filteredData;
    });
  res.send(result);
});

module.exports = router;

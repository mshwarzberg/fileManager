const express = require("express");
const fs = require("fs");
const router = express.Router();
const fastFolderSize = require('fast-folder-size')
const { promisify } = require('util')
const ffmpeg = require("fluent-ffmpeg");
const sharp = require("sharp");

function checkType(type) {
  type = type.toLowerCase();

  const checkIfImage = [
    type === "jpg",
    type === "png",
    type === "jpeg",
    type === "xcf",
  ];
  const checkIfVideo = [
    type === "mp4",
    type === "mkv",
    type === "webm",
    type === "avi",
    type === "wmv",
  ];

  const checkIfGif = [type === "gif"];

  const checkIfText = [type === "txt", type === "rtf", type === "ion", type === 'docx'];

  if (checkIfImage.includes(true)) {
    return "imageIcon";
  }
  if (checkIfVideo.includes(true)) {
    return "videoIcon";
  }
  if (checkIfGif.includes(true)) {
    return "gifIcon";
  }
  if (checkIfText.includes(true)) {
    return "documentIcon";
  } else {
    return "unknownIcon";
  }
}

let currentdirectory;
let subDirSizes = {}

function checkIfFileOrDir(file) {
  var methods = ["isDirectory", "isFile"];

  // check if current item in directory is a file or a sub-directory
  var item = { name: file.name };
  for (var method of methods) {
    if (file[method]() === true) {
      item[method] = file[method]();
    }
  }
  return item
}

// when a user enters a new folder create all the subdirectories for the thumbnails.
function newDirs(req, res, next) {

  currentdirectory = `${req.body.currentdirectory}`;
  const fastFolderSizeSync = promisify(fastFolderSize)
  // create folder of the current directory within the thumbnails folder to store the thumbnails
  fs.mkdir(`./thumbnails/${currentdirectory}`, { recursive: true }, () => {
    fs.readdir(`./${currentdirectory}`, {withFileTypes: true}, (err, files) => {
      if (err) console.log('cant make dir', err);
      for (let i = 0; i < files.length - 1; i++) {
        if (checkIfFileOrDir(files[i]).isDirectory) {
            fastFolderSizeSync(`./${currentdirectory}/${files[i].name}`,(err, bytes) => {
              if (err) {
                console.log(err);
              }
              subDirSizes = {
                ...subDirSizes,
                [currentdirectory]: bytes
              }
              return subDirSizes
            })
          fs.mkdir(`./thumbnails/${currentdirectory}/${files[i].name}`, () => {})
        }
      }
    });
  });
  next()
}

router.post("/loaddata", newDirs, (req, res) => {
  // generate all the file in the current folder
  var result = fs
  .readdirSync(`./${currentdirectory}`, { withFileTypes: true })
  .map((file) => {
    let suffix = "";

      const item = checkIfFileOrDir(file)

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

      // before generating thumbnail check if it already exists
      fs.readdir(`./thumbnails/${currentdirectory}`, (err, files) => {
        if (err) console.log(err);
        if (files.indexOf(`thumbnail-${prefix}${suffix}.jpeg`) === -1) {
          // generate thumbnails for videos and gifs
          if (
            checkType(suffix) === "videoIcon" ||
            checkType(suffix) === "gifIcon"
          ) {
            ffmpeg(`./${currentdirectory}/${file.name}`).screenshots({
              count: 1,
              folder: `./thumbnails/${currentdirectory}`,
              timestamps: ["70%"],
              filename: `thumbnail-${prefix}${suffix}.jpeg`,
            });
          }
          // generate thumbnails for images
          else if (checkType(suffix) === "imageIcon" && suffix !== "xcf") {
            sharp(`./${currentdirectory}/${file.name}`)
              .resize({ width: 512 })
              .toFile(
                `./thumbnails/${currentdirectory}/thumbnail-${prefix}${suffix}.jpeg`
              )
              .then((res) => {
                return;
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      });
      
      const filteredData = {
        ...item,
        itemtype: item.isDirectory ? "folderIcon" : checkType(suffix),
        fileextension: suffix || "Directory",
        prefix: prefix,
        size: fs.statSync(`${currentdirectory}/${file.name}`).size,
      };
      return filteredData;
    })
  res.send([...result, { currentdirectory: currentdirectory }]);
});

router.post("/getthumbs", newDirs, (req, res) => {
  const { currentdirectory, prefix, suffix } = req.body;
  fs.readdir(`./thumbnails/${currentdirectory}`, (err, files) => {
    if (err) console.log(err);
    if (files.indexOf(`thumbnail-${prefix}${suffix}.jpeg`) !== -1) {
      const options = {
        root: "./",
        headers: {
          prefix: prefix,
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

module.exports = router;

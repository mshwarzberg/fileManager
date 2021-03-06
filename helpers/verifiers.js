const fs = require("fs");

function verifyFolder(req, res, next) {
  if (fs.existsSync(`${"/" || req.body.currentdirectory}`)) {
    return next();
  }
  return res.send([{ err: "ERROR: FOLDER DOES NOT EXIST" }]).status(404);
}

function checkType(type) {
  if (type) {
    type = type.toLowerCase();
  }

  const checkIfImage = [
    type === "jpg",
    type === "png",
    type === "jpeg",
    type === "avif",
    type === "svg",
    type === "tiff",
    type === "bmp",
    type === "cur",
  ];
  const checkIfVideo = [
    type === "mp4",
    type === "mkv",
    type === "webm",
    type === "avi",
    type === "wmv",
  ];

  const checkIfGif = [type === "gif"];

  const checkIfText = [
    type === "txt",
    type === "rtf",
    type === "ion",
    type === "docx",
    type === "json",
    type === "jsx",
    type === "js",
    type === "scss",
    type === "md",
    type === "py",
    type === "css",
    type === "html",
    type === "xhtml",
    type === "ini",
    type === "lnk",
  ];

  if (checkIfImage.includes(true)) {
    return "image";
  }
  if (checkIfVideo.includes(true)) {
    return "video";
  }
  if (checkIfGif.includes(true)) {
    return "gif";
  }
  if (checkIfText.includes(true)) {
    return "document";
  } else {
    return "unknown";
  }
}

module.exports = { verifyFolder, checkType };

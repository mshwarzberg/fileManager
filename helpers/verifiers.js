const fs = require("fs");

function verifyFolder(req, res, next) {
  if (fs.existsSync(`${'/' || req.body.currentdirectory}`)) {
    return next();
  }
  return res.send({ err: "ERROR: FOLDER DOES NOT EXIST" });
}

function checkType(type) {
  type = type?.toLowerCase();

  const checkIfImage = [
    type === "jpg",
    type === "png",
    type === "jpeg",
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
    type === 'json',
    type === 'ion',
    type === 'jsx', 
    type === 'js',
    type === 'scss'
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

module.exports = { verifyFolder, checkType }
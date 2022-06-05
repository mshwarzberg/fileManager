const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.post("/file", (req, res) => {
  let type;
  if (req.body.type === "image" || req.body.type === "gif") {
    type = "imagegif";
  } else {
    type = "document";
  }
  return res.sendFile(`${req.body.path}`, {
    root: "",
    headers: {
      type: type,
    },
  });
});

router.get("/playvideo/:video", (req, res) => {
  if (!req.params.video) {
    return res.end();
  }
  
  const filePath = decodeURIComponent(req.params.video);
  const totalSize = fs.statSync(filePath).size;
  const range = req.headers.range;
  let ext = path.extname(filePath);
  ext = ext.slice(1, ext.length);
  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;

  const chunksize = end - start + 1;
  const file = fs.createReadStream(filePath, { start, end });

  const head = {
    "Content-Range": `bytes ${start}-${end}/${totalSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": chunksize,
    "Content-Type": `video/mp4`,
  };
  res.writeHead(206, head);
  file.pipe(res);
});

module.exports = router;

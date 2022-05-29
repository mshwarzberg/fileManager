const express = require("express");
const router = express.Router();
const fs = require("fs");

let currentdirectory;

router.post("/setdirectorytocurrent", (req, res) => {
  currentdirectory = req.body.currentdirectory;
  res.end();
});

router.post("/file", (req, res) => {
  let type
  if (req.body.type === 'image' || req.body.type === 'gif') {
    type = 'imagegif'
  } else {
    type = 'document'
  }
  return res.sendFile(`${currentdirectory}/${req.body.file}`, {
    root: "/",
    headers: {
      type: type
    }
  });
});

router.get("/playvideo/:video", (req, res) => {
  const path = `${currentdirectory}/${req.params.video}`;
  const totalSize = fs.statSync(path).size;
  const range = req.headers.range;
  
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;

    const chunksize = end - start + 1;
    const file = fs.createReadStream(path, { start, end });

    const head = {
      "Content-Range": `bytes ${start}-${end}/${totalSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/*",
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": totalSize,
      "Content-Type": "video/*",
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
});

module.exports = router;

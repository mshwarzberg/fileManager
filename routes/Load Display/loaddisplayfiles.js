const express = require("express");
const router = express.Router();
const fs = require("fs");

const io = require("socket.io")(5001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("get-document", async (data) => {
    const tempFile =
      data.drive +
      "temp/" +
      data.directory.split(data.drive)[1] +
      `/${data.name}`;

    let fileContent;
    try {
      fileContent = fs.readFileSync(tempFile);
    } catch (e) {
      fileContent = fs.readFileSync(data.file);
      fileContent = fs.writeFileSync(
        tempFile,
        JSON.stringify({
          ops: [{ insert: fileContent.toString().split("\n") }],
        })
      );
    }
    socket.emit("load-document", fileContent.toString());

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(data).emit("receive-changes", delta);
    });

    socket.on("save-document", async (updatedData) => {
      // await Document.findByIdAndUpdate(documentId, { updatedData });
    });
  });
});

router.post("/file", (req, res) => {
  const { path, drive } = req.body;
  let currentdirectory = path.slice(drive.length, path.length);

  return res.sendFile(currentdirectory, {
    root: drive,
  });
});

router.get("/playvideo/:video", (req, res) => {
  if (!req.params.video) {
    return res.end();
  }

  const filePath = decodeURIComponent(req.params.video);
  const totalSize = fs.statSync(filePath).size;
  const range = req.headers.range;

  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;

  const chunksize = end - start + 1;
  const file = fs.createReadStream(filePath, {
    start,
    end,
  });

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

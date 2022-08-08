const express = require("express");
const router = express.Router();
const fs = require("fs");
const { ffprobeMetadata } = require("../../helpers/ffmpegfunctions");
const { verifyFolder, checkType } = require("../../helpers/verifiers");

router.post("/", verifyFolder, (req, res) => {
  const { currentdirectory, name } = req.body;
  if (
    checkType(name)[0] === "video" ||
    checkType(name)[0] === "gif" ||
    checkType(name)[0] === "image"
  ) {
    ffprobeMetadata(`${currentdirectory}${name}`, (data) => {
      return res.send(data);
    });
  } else {
    res.end();
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const fs = require("fs");
const { ffprobeMetadata } = require("../../helpers/ffmpegfunctions");
const { verifyFolder, checkType } = require("../../helpers/verifiers");

router.post("/", verifyFolder, (req, res) => {
  const { currentdirectory, fileextension, prefix } = req.body;

  if (
    checkType(fileextension) === "video" ||
    checkType(fileextension) === "gif" ||
    checkType(fileextension) === "image"
  ) {
    ffprobeMetadata(
      `${currentdirectory}/${prefix}.${fileextension}`,
      (data) => {
        return res.send(data);
      }
    );
  } else {
    res.end();
  }
});

module.exports = router;

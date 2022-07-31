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
        return res.send({
          width: data.width || "",
          height: data.height || "",
          ...(data.duration > 0.1 && {
            duration: data.duration,
          }),
        });
      }
    );
  } else {
    res.end();
  }
});

module.exports = router;

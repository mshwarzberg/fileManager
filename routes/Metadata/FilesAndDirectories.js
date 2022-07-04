const express = require("express");
const fs = require("fs");
const router = express.Router();

const Metadata = require("../../helpers/metadata");
const { verifyFolder } = require("../../helpers/verifiers");
const {
  makeThumbnailDirectories,
} = require("../../middleware/makethumbnaildirectories");

router.post("/", verifyFolder, makeThumbnailDirectories, (req, res) => {
  const { currentdirectory, drive } = req.body;
  // generate all the file in the current folder
  var result = fs
    .readdirSync(`${currentdirectory}`, { withFileTypes: true })
    .map((file) => {
      return Metadata(file, currentdirectory, drive);
    });
  res.send(result);
});

module.exports = router;

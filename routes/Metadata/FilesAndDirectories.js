const express = require("express");
const fs = require("fs");
const router = express.Router();

const Metadata = require("../../helpers/metadata");
const { verifyFolder } = require("../../helpers/verifiers");
const { makeThumbs } = require("../../helpers/makethumbnails");

router.post("/", verifyFolder, (req, res) => {
  const { currentdirectory, drive } = req.body;
  // generate all the file in the current folder
  var result = fs
    .readdirSync(`${currentdirectory}`, { withFileTypes: true })
    .map((file) => {
      return Metadata(file, currentdirectory, drive);
    })
    .filter((item) => {
      return item.name && item;
    });

  res.send(result);

  fs.readdir(currentdirectory, { withFileTypes: true }, (err, files) => {
    if (err) return console.log("Files and Directories", err);
    if (files) {
      const restOfPath = currentdirectory.slice(
        drive.length,
        currentdirectory.length
      );
      for (const file of files) {
        fs.mkdir(
          `${drive}/temp/${restOfPath}/`,
          {
            recursive: true,
          },
          (err) => {
            if (!err) {
              for (let i = file.name.length - 1; i > 0; i--) {
                if (file.name[i] === ".") {
                  const fileextension = file.name.slice(i + 1, Infinity);
                  const prefix = file.name.slice(0, i);
                  makeThumbs(drive, currentdirectory, prefix, fileextension);
                  break;
                }
              }
            }
          }
        );
      }
    }
  });
});

module.exports = router;

const fs = require("fs");
const { checkIfFileOrDir } = require("../helpers/getfileparts");

// when a user enters a new folder create all the subdirectories for the thumbnails.
function makeThumbnailDirectories(req, res, next) {
  let { currentdirectory, drive } = req.body;

  let restOfPath = currentdirectory.slice(
    drive.length,
    currentdirectory.length
  );
  // create folder of the current directory within the thumbnails folder to store the thumbnails
  const makeDirectories = new Promise((resolve, reject) => {
    fs.mkdir(`${drive}/thumbnails/temp`, { recursive: true }, () => {
      fs.readdir(
        `${currentdirectory}`,
        { withFileTypes: true },
        (err, files) => {
          if (err) {
            reject("cant make dir");
          }
          if (files) {
            for (let i = 0; i < files.length; i++) {
              if (checkIfFileOrDir(files[i]).isDirectory) {
                fs.mkdirSync(
                  `${drive}/thumbnails/${restOfPath}/${files[i].name}`,
                  { recursive: true }
                );
                // console.log(
                //   `made ${drive}/thumbnails/${restOfPath}/${files[i].name}`
                // );
              }
            }
          }
          resolve("Done");
        }
      );
    });
  });

  makeDirectories
    .then(() => {
      next();
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = { makeThumbnailDirectories };

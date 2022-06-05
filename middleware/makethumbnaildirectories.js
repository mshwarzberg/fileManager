const fs = require("fs");
const { checkIfFileOrDir } = require("../helpers/getfileparts");

// when a user enters a new folder create all the subdirectories for the thumbnails.
function makeThumbnailDirectories(req, res, next) {
  const { currentdirectory } = req.body;
  let root = currentdirectory.slice(0, 2);
  let restOfPath = currentdirectory.slice(3, currentdirectory.length);
  // create folder of the current directory within the thumbnails folder to store the thumbnails
  const makeDirectories = new Promise((resolve, reject) => {
    fs.mkdir(`${root}/thumbnails`, { recursive: true }, () => {
      fs.readdir(
        `${currentdirectory}`,
        { withFileTypes: true },
        (err, files) => {
          if (err) {
            reject("cant make dir");
          }
          if (files) {
            for (let i = 0; i < files.length - 1; i++) {
              if (checkIfFileOrDir(files[i]).isDirectory) {
                fs.mkdir(
                  `${root}/thumbnails/${restOfPath}/${files[i].name}`,
                  { recursive: true },
                  () => {
                    resolve(
                      `made ${root}/thumbnails/${restOfPath}/${files[i].name}`
                    );
                  }
                );
              }
            }
          }
          resolve();
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

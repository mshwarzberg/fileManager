const fs = require("fs");
const { checkIfFileOrDir } = require("../helpers/getfileparts");

// when a user enters a new folder create all the subdirectories for the thumbnails.
function makeThumbnailDirectories(req, res, next) {
  const { currentdirectory } = req.body;
  // create folder of the current directory within the thumbnails folder to store the thumbnails
  const makeDirectories = new Promise((resolve, reject) => {
    fs.mkdir(`./thumbnails/${currentdirectory}`, { recursive: true }, () => {
      fs.readdir(
        `${currentdirectory}`,
        { withFileTypes: true },
        (err, files) => {
          if (err) {
            console.log("cant make dir", err);
            reject();
          }
          for (let i = 0; i < files?.length - 1; i++) {
            if (checkIfFileOrDir(files[i]).isDirectory) {
              fs.mkdir(
                `./thumbnails/${currentdirectory}/${files[i].name}`,
                () => {
                  resolve();
                }
              );
            }
          }
        }
      );
    });
  });

  makeDirectories.then(next()).catch((err) => {
    console.log(err);
  });
}

module.exports = { makeThumbnailDirectories };

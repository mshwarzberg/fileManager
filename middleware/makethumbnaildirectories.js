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
    fs.mkdir(`${drive}/temp`, { recursive: true }, () => {
      fs.readdir(
        `${currentdirectory}`,
        { withFileTypes: true },
        (err, files) => {
          if (err) {
            if (err.code === "ENOENT") {
              return reject("Folder doesn't exist");
            }
            return reject("cant make dir");
          }
          if (files) {
            for (let i = 0; i < files.length; i++) {
              if (checkIfFileOrDir(files[i]).isDirectory) {
                try {
                  fs.mkdirSync(`${drive}/temp/${restOfPath}/${files[i].name}`, {
                    recursive: true,
                  });
                } catch {}
                resolve();
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
      return res.status(404).send({ err: err });
    });
}

module.exports = { makeThumbnailDirectories };

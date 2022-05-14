const fs = require("fs");
const {checkIfFileOrDir} = require('./isfileordirectory')
const { checkType} = require('../helpers/verifiers')

function getFileNameParts(file, directory) {

  const item = checkIfFileOrDir(file);

  let suffix = "";
  // get the file extension
  if (!item.isDirectory) {
    for (let i = file.name.length - 1; i > 0; i--) {
      if (file.name[i] !== "." && suffix === "") {
        suffix = file.name[i];
      } else if (file.name[i] !== ".") {
        suffix = file.name[i] + suffix;
      } else {
        break;
      }
    }
  }
  // get the filename without the extension
  let prefix = "";

  // if the item is a folder don't remove anything. keep the file as is (even if it has a period in the name)
  for (let j = 0; j < file.name.length - (suffix?.length + 1); j++) {
    if (prefix === "") {
      prefix = file.name[j];
    } else {
      prefix += file.name[j];
    }
  }

  const filteredData = {
    ...item,
    itemtype: item.isDirectory ? "folder" : checkType(suffix),
    fileextension: suffix || "Directory",
    prefix: encodeURIComponent(prefix),
    size: fs.statSync(`${directory}/${file.name}`).size,
  };

  return filteredData;
}

module.exports = { getFileNameParts, checkIfFileOrDir }
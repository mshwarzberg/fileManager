const fs = require("fs");
const os = require("os");
const { checkIfFileOrDir } = require("./isfileordirectory");
const { checkType } = require("./verifiers");

function Metadata(file, directory, drive) {
  const item = checkIfFileOrDir(file);
  let fileextension = "";
  // get the file extension
  if (!item.isDirectory) {
    for (let i = file.name.length - 1; i >= 0; i--) {
      if (file.name[i] !== "." && fileextension === "") {
        fileextension = file.name[i];
      } else if (file.name[i] !== ".") {
        fileextension = file.name[i] + fileextension;
      } else {
        break;
      }
    }
  }

  // get the filename without the extension
  let prefix = "";
  // if the item is a folder don't remove anything. keep the file as is (even if it has a period in the name)
  for (
    let j = 0;
    j < file.name.length - (fileextension ? fileextension.length + 1 : 0);
    j++
  ) {
    if (prefix === "") {
      prefix = file.name[j];
    } else {
      prefix += file.name[j];
    }
  }
  let sizeOf, symLink;
  let permission = true;
  try {
    var { size, birthtimeMs, mtimeMs, atimeMs } = fs.statSync(
      `${directory === "/" ? directory : directory + "/"}${file.name}`
    );
    dateAccessed = atimeMs;
    dateModified = mtimeMs;
    dateCreated = birthtimeMs;
    sizeOf = size;

    if (item.isSymbolicLink) {
      symLink = fs.readlinkSync(
        `${directory === "/" ? directory : directory + "/"}${file.name}`
      );
      symLink = symLink.slice(2, symLink.length);
      symLink = symLink.replaceAll("\\", "/");
    }
  } catch {
    sizeOf = 0;
    permission = false;
  }

  if (
    (file.name === "temp" || file.name === "$RECYCLE.BIN") &&
    item.isDirectory &&
    directory === drive
  ) {
    return {};
  }
  let isMedia, restOfPath;
  if (
    checkType(fileextension) === "video" ||
    checkType(fileextension) === "image" ||
    checkType(fileextension) === "gif"
  ) {
    isMedia = true;
    restOfPath = directory.slice(drive.length, directory.length);
  }

  const filteredData = {
    ...item,
    path: `${directory}${file.name}`,
    itemtype: item.isDirectory ? "folder" : checkType(fileextension),
    fileextension: fileextension || "",
    prefix: prefix,
    permission: permission,
    size: sizeOf || 0,
    accessed: dateAccessed || 0,
    modified: dateModified || 0,
    created: dateCreated || 0,
    ...(symLink && { linkTo: symLink }),
    ...(isMedia && {
      thumbPath: `${drive}/temp/${restOfPath}/${prefix + fileextension}.jpeg`,
    }),
  };
  return filteredData;
}

module.exports = Metadata;

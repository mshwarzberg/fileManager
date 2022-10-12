import randomID from "../RandomID";
import checkFileType from "./CheckFileType";

const fs = window.require("fs");
const path = window.require("path");

function checkIfFileOrDir(file) {
  var methods = [
    "isBlockDevice",
    "isCharacterDevice",
    "isDirectory",
    "isFIFO",
    "isFile",
    "isSocket",
    "isSymbolicLink",
  ];

  var item = { name: file.name };
  for (var method of methods) {
    if (file[method]() === true) {
      item[method] = file[method]();
    }
  }
  return item;
}

export default function formatMetadata(file, directory, drive, isNetworkDrive) {
  const item = checkIfFileOrDir(file);
  const { name } = file;
  let fileextension = file.isFile()
    ? path.extname(directory + name).toLowerCase()
    : "";
  let itemtype = checkFileType(fileextension);

  let sizeOf, symLink, dateAccessed, dateCreated, dateModified;
  let permission = true;
  try {
    var { size, birthtimeMs, mtimeMs, atimeMs } = fs.statSync(
      `${directory === "/" ? directory : directory + "/"}${name}`
    );
    dateAccessed = atimeMs;
    dateModified = mtimeMs;
    dateCreated = birthtimeMs;
    sizeOf = size;

    if (item.isSymbolicLink) {
      symLink = fs.readlinkSync(`${directory}/${name}`).replaceAll("\\", "/");
    }
  } catch {
    sizeOf = 0;
    permission = false;
  }

  if (
    (name === "temp" ||
      name === "$RECYCLE.BIN" ||
      name === "System Volume Information" ||
      name === "trash") &&
    item.isDirectory &&
    directory === drive
  ) {
    return {};
  }
  let isMedia, restOfPath, thumbPath;
  if (itemtype === "video" || itemtype === "image" || itemtype === "gif") {
    isMedia = true;
    restOfPath = directory.slice(3, Infinity);
    thumbPath = `${drive}temp/${restOfPath}${name}.jpeg`;
    if (itemtype === "image" && sizeOf < 300000) {
      thumbPath = directory + name;
    }
  }

  const filtered = {
    ...item,
    path: directory + name,
    displayName: name,
    displayLocation: directory,
    displayPath: directory + name,
    key: randomID(),
    location: directory,
    fileextension: fileextension || "",
    permission: permission,
    size: sizeOf || 0,
    accessed: dateAccessed || 0,
    modified: dateModified || 0,
    created: dateCreated || 0,
    filetype: checkFileType(fileextension),
    isMedia: isMedia,
    ...(symLink && { linkTo: symLink }),
    ...(thumbPath &&
      !isNetworkDrive && {
        thumbPath: thumbPath,
      }),
  };

  return filtered;
}

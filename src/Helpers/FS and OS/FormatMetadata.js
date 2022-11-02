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

export default function formatMetadata(file, directory, drive) {
  const item = checkIfFileOrDir(file);
  const { name } = file;

  if (
    (name.toLowerCase() === "system volume information" ||
      name.toLowerCase() === "trash") &&
    directory === drive
  ) {
    return {};
  }
  if (name.startsWith("$")) {
    return {};
  }
  let fileextension = file.isFile()
    ? path.extname(directory + name).toLowerCase()
    : "";
  let itemtype = checkFileType(fileextension);

  let sizeOf, symLink, dateAccessed, dateCreated, dateModified;
  let permission = true;
  try {
    var { size, birthtimeMs, mtimeMs, atimeMs } = fs.statSync(
      `${directory}${name}`
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

  let isMedia, thumbPath;
  if (
    itemtype === "video" ||
    itemtype === "image" ||
    itemtype === "gif" ||
    itemtype === "audio"
  ) {
    isMedia = true;
    if (itemtype !== "audio") {
      thumbPath = `${directory}$Thumbs$/${name}.jpeg`;
      if (itemtype === "image" && sizeOf < 300000) {
        thumbPath = directory + name;
      }
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
    fileextension: fileextension,
    permission: permission,
    size: sizeOf,
    accessed: dateAccessed || 0,
    modified: dateModified || 0,
    created: dateCreated || 0,
    filetype: checkFileType(fileextension),
    isMedia: isMedia,
    prefix: name.slice(0, name.length - fileextension.length),
    ...(symLink && { linkTo: symLink }),
    ...(thumbPath && { thumbPath: thumbPath }),
  };

  return filtered;
}

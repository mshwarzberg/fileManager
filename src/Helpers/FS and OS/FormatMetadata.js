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

  const filtered = {
    ...item,
    path: directory + name,
    location: directory,
    ...itemData(file, directory),
    isFile: item.isFile,
  };

  return filtered;
}

export function itemData(file, directory, isTrash) {
  let name = file.name;
  if (isTrash) {
    directory = directory.split("/$");
    const len = directory.length - 1;
    name = "$" + directory[len];
    directory = directory[0] + "/$" + directory[len - 1] + "/";
  }
  let fileextension = file.isFile()
    ? path.extname(directory + name).toLowerCase()
    : "";
  let itemtype = checkFileType(fileextension);
  let sizeOf, symLink, dateAccessed, dateCreated, dateModified;
  let permission = true;

  try {
    const { size, birthtimeMs, mtimeMs, atimeMs } = fs.statSync(
      directory + name
    );
    dateAccessed = atimeMs;
    dateModified = mtimeMs;
    dateCreated = birthtimeMs;
    sizeOf = size;
  } catch {
    sizeOf = 0;
    permission = false;
  }

  try {
    if (file.isSymbolicLink()) {
      symLink = fs.readlinkSync(directory + "/" + name).replaceAll("\\", "/");
    }
  } catch (error) {}

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

  return {
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
    displayName: file.name,
    displayLocation: file.displayLocation || directory,
    displayPath: (file.displayLocation || directory) + file.name,
    isFile: !file.isDirectory,
    key: randomID(10),
  };
}

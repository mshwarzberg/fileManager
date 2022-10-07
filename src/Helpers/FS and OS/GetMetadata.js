import randomID from "../RandomID";
import checkFileType from "./CheckFileType";

const fs = window.require("fs");

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
  let fileextension, itemtype;

  if (!item.isDirectory) {
    [itemtype, fileextension] = checkFileType(file.name);
  }

  let prefix = file.name.slice(0, file.name.length - fileextension?.length - 1);

  let sizeOf, symLink, dateAccessed, dateCreated, dateModified;
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
      symLink = fs
        .readlinkSync(`${directory}/${file.name}`)
        .replaceAll("\\", "/");
    }
  } catch {
    sizeOf = 0;
    permission = false;
  }

  if (
    (file.name === "temp" ||
      file.name === "$RECYCLE.BIN" ||
      file.name === "System Volume Information") &&
    item.isDirectory &&
    directory === drive
  ) {
    return {};
  }
  let isMedia, restOfPath, thumbPath;
  if (itemtype === "video" || itemtype === "image" || itemtype === "gif") {
    isMedia = true;
    restOfPath = directory.slice(3, Infinity);
    thumbPath = `${drive}temp/${restOfPath}${file.name}.jpeg`;
    if (itemtype === "image" && sizeOf < 300000) {
      thumbPath = directory + file.name;
    }
  }

  const filteredData = {
    ...item,
    key: randomID(),
    location: directory,
    fileextension: fileextension || "",
    prefix: prefix,
    permission: permission,
    size: sizeOf || 0,
    accessed: dateAccessed || 0,
    modified: dateModified || 0,
    created: dateCreated || 0,
    filetype: checkFileType(file.name)[0],
    isMedia: isMedia,
    ...(symLink && { linkTo: symLink }),
    ...(thumbPath &&
      !isNetworkDrive && {
        thumbPath: thumbPath,
      }),
  };

  return filteredData;
}

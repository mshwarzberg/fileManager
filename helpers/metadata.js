const fs = require("fs");
const { checkType } = require("./verifiers");

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

  // check if current item in directory is a file or a sub-directory
  var item = { name: file.name };
  for (var method of methods) {
    if (file[method]() === true) {
      item[method] = file[method]();
    }
  }
  return item;
}
function Metadata(file, directory, drive) {
  const item = checkIfFileOrDir(file);
  let fileextension;
  let itemtype;

  if (!item.isDirectory) {
    [itemtype, fileextension] = checkType(file.name);
  }

  let prefix = file.name.slice(0, file.name.length - fileextension?.length - 1);

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
    directory === drive + "/"
  ) {
    return {};
  }
  let isMedia, restOfPath, thumbPath;
  if (itemtype === "video" || itemtype === "image" || itemtype === "gif") {
    isMedia = true;
    restOfPath = directory.slice(3, Infinity);
    thumbPath = `${drive}temp/${restOfPath}/${prefix + fileextension}.jpeg`;
  }

  const filteredData = {
    ...item,
    path: directory,
    itemtype: item.isDirectory ? "folder" : itemtype,
    fileextension: fileextension || "",
    prefix: prefix,
    permission: permission,
    size: sizeOf || 0,
    accessed: dateAccessed || 0,
    modified: dateModified || 0,
    created: dateCreated || 0,
    isMedia: isMedia,
    ...(symLink && { linkTo: symLink }),
    ...(thumbPath && {
      thumbPath: thumbPath,
    }),
  };

  return filteredData;
}

module.exports = Metadata;

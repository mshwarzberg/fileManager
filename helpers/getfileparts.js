const fs = require("fs");
const os = require("os");
const { checkIfFileOrDir } = require("./isfileordirectory");
const { checkType } = require("../helpers/verifiers");
const { formatSize } = require("../helpers/formatsize");

function getFileNameParts(file, directory) {
  const item = checkIfFileOrDir(file);
  let suffix = "";
  // get the file extension
  if (!item.isDirectory) {
    for (let i = file.name.length - 1; i >= 0; i--) {
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
  for (
    let j = 0;
    j < file.name.length - (suffix ? suffix.length + 1 : 0);
    j++
  ) {
    if (prefix === "") {
      prefix = file.name[j];
    } else {
      prefix += file.name[j];
    }
  }
  let sizeOf;
  let symLink;
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

  let isDrive = "";
  if (os.platform() === "win32") {
    isDrive = directory.match(/^.:\//gm);
  }

  const filteredData = {
    ...item,
    path: `${directory === isDrive[0] ? directory : directory + "/"}${
      file.name
    }`,
    itemtype: item.isDirectory ? "folder" : checkType(suffix),
    fileextension: suffix || "",
    prefix: encodeURIComponent(prefix),
    permission: permission,
    ...(permission && {
      ...(!item.isDirectory && {
        size: sizeOf,
        formattedSize: formatSize(sizeOf),
      }),
      accessed: dateAccessed,
      modified: dateModified,
      created: dateCreated,
    }),
    ...(symLink && { linkTo: symLink }),
  };
  return filteredData;
}

module.exports = { getFileNameParts, checkIfFileOrDir };

import CompareFiles from "../../Components/Miscellaneous/CompareFiles";

const fs = window.require("fs");
const { execSync } = window.require("child_process");

export function handleTransfer(destination, setPopup, clipboard, setClipboard) {
  const { source, mode, info } = clipboard;

  function transfer(sourcePath, name, destination, isFile) {
    let command = "";
    // use location for files and path for everything else
    if (!isFile) {
      command = `robocopy "${sourcePath}" "${destination}/${name}" ${
        mode === "copy" ? "" : "/move"
      }`;
    } else {
      command = `robocopy "${sourcePath}" "${destination}" "${name}" ${
        mode === "copy" ? "" : "/mov"
      }`;
    }

    try {
      execSync(command);
    } catch (error) {}
  }

  if (source === destination) {
    if (mode === "cut") {
      setClipboard({});
      return;
    }
    for (const { path, fileextension, isFile, location, prefix } of info) {
    }
  } else {
    for (const { path, location, isFile, name } of info) {
      transfer(isFile ? location : path, name, destination, isFile);
    }
  }
}

function checkForDuplicates(directory, itemNames) {
  const duplicates = [];
  for (const itemName of itemNames) {
    if (fs.readdirSync(directory).includes(itemName)) {
      duplicates.push(itemName);
    }
  }
  return duplicates;
}

function copyItems(source, destination, isFile) {
  const formatName = `"${source}" "${destination}"`.replaceAll("/", "\\");
  if (isFile) {
    const copy = `copy ${formatName}`;
    try {
      execSync(copy);
    } catch (error) {}
  } else {
    execSync(`xcopy ${formatName}\\ /s /h /e`);
  }
}

function moveItems(source, destination) {
  const formatName = `"${source}" "${destination}"`.replaceAll("/", "\\");
  execSync(`move ${formatName}`);
}

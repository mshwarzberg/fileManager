import formatMetadata from "./GetMetadata";

const fs = window.require("fs");
const { exec } = window.require("child_process");

function transfer(sourcePath, destinationPath, name, isFile, mode) {
  let command = "";
  // use location for files and path for everything else
  if (!isFile) {
    command = `robocopy "${sourcePath}" "${destinationPath}/${name}" ${
      mode === "copy" ? "" : "/move"
    }`;
  } else {
    command = `robocopy "${sourcePath}" "${destinationPath}" "${name}" ${
      mode === "copy" ? "" : "/mov"
    }`;
    if (!isFile && mode === "cut") {
      return moveItems(sourcePath + name, destinationPath);
    }
  }

  try {
    exec(command, () => {});
  } catch (error) {}
}

function copyItems(source, destination, isFile) {
  const formatName = `"${source}" "${destination}"`.replaceAll("/", "\\");
  if (isFile) {
    const copy = `copy ${formatName}`;
    try {
      exec(copy);
    } catch (error) {}
  } else {
    exec(`xcopy ${formatName}\\ /s /h /e`);
  }
}

function moveItems(source, destination) {
  const formatName = `move "${source}" "${destination}"`.replaceAll("/", "\\");
  exec(formatName);
}

function checkForDuplicates(destination, source, itemNames) {
  const duplicates = [];

  const result = fs.readdirSync(destination, { withFileTypes: true });
  for (const item of result) {
    const formatted = formatMetadata(
      item,
      destination,
      destination.slice(0, 3)
    );
    if (itemNames.includes(formatted.name)) {
      duplicates.push({ ...formatted, source: source + formatted.name });
    }
  }

  return duplicates;
}

export { transfer, copyItems, moveItems, checkForDuplicates };

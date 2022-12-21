const fs = window.require("fs");

export default function newDirectory(currentDirectory) {
  let i = 1;
  while (true) {
    const newDirectoryName = `New Folder${i > 1 ? ` (${i})` : ""}`;
    try {
      fs.accessSync(currentDirectory + newDirectoryName);
    } catch {
      fs.mkdirSync(currentDirectory + newDirectoryName);
      return newDirectoryName;
    }
    i++;
  }
}

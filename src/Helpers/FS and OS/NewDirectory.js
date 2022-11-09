const fs = window.require("fs");

export default function newDirectory(state) {
  let i = 1;
  while (true) {
    const newDirectoryName = `New Folder${i > 1 ? ` (${i})` : ""}`;
    try {
      fs.accessSync(state.currentDirectory + newDirectoryName);
    } catch {
      fs.mkdirSync(state.currentDirectory + newDirectoryName);
      return newDirectoryName;
    }
    i++;
  }
}

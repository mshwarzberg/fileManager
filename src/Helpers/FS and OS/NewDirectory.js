const fs = window.require("fs");

export default function newDirectory(state) {
  for (let i = 0; i < 1000; i++) {
    const newDirectoryName = `New Folder${i > 1 ? ` (${i})` : ""}`;
    try {
      fs.accessSync(state.currentDirectory + newDirectoryName);
    } catch {
      fs.mkdirSync(state.currentDirectory + newDirectoryName);
      return newDirectoryName;
    }
  }
}

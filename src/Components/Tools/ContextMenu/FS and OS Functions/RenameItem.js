const fs = window.require("fs");

export default function renameItem(originalPath, newPath) {
  return new Promise((resolve, reject) => {
    try {
      fs.renameSync(originalPath, newPath);
    } catch (e) {
      reject(e.toString());
    }
    resolve();
  });
}

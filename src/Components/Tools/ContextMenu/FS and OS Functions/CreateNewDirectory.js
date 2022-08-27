const fs = window.require("fs");

export default function createNewDirectory(path) {
  return new Promise((resolve, reject) => {
    try {
      fs.mkdirSync(path);
    } catch (e) {
      reject(e.toString());
    }
    resolve();
  });
}

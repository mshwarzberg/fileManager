const fs = window.require("fs");

export default function transferItems(source, mode, destination) {
  return new Promise((resolve, reject) => {
    if (mode === "copy") {
      copyDir(source.path, source.name, destination, source.isDirectory);
    } else {
      fs.renameSync(source.path + source.name, destination + "/" + source.name);
    }
    resolve();
  });
}

function copyDir(srcPath, srcName, destination, isSrcNameDirectory) {
  return new Promise((resolve, reject) => {
    if (isSrcNameDirectory) {
      fs.mkdirSync(destination + srcName, { recursive: true });
      const items = fs.readdirSync(srcPath + srcName, { withFileTypes: true });
      for (const item of items) {
        if (item.isDirectory()) {
          copyDir(srcPath + srcName, item.name, destination, true);
        } else {
          fs.copyFileSync(
            `${srcPath}${srcName}/${item.name}`,
            `${destination}${srcName}/${item.name}`
          );
        }
      }
    } else {
      fs.copyFileSync(srcPath + srcName, destination + srcName);
    }
    resolve();
  });
}

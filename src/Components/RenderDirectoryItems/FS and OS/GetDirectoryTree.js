import CheckType from "../../../Helpers/FS and OS Helpers/CheckType";
const fs = window.require("fs");

export default function getDirectoryTree(path) {
  return new Promise((resolve, _) => {
    fs.readdir(path + "/", { withFileTypes: true }, (error, files) => {
      if (error) return console.log(error);
      let dirArray = [];
      for (const item of files) {
        if (
          (item.name === "temp" ||
            item.name === "$RECYCLE.BIN" ||
            item.name === "System Volume Information") &&
          path.length === 3
        ) {
          continue;
        }
        let permission = true;
        try {
          fs.statSync(`${path}/${item.name}`);
        } catch {
          permission = false;
        }
        let symLink;
        if (item.isSymbolicLink()) {
          symLink = fs.readlinkSync(path + "/" + item.name);
          symLink = symLink.replaceAll("\\", "/");
        }

        dirArray.push({
          path: path + item.name + (item.isDirectory() ? "/" : ""),
          name: item.name,
          itemtype: CheckType(item.name)[0],
          permission: permission,
          isFile: item.isFile(),
          isDirectory: item.isDirectory(),
          isSymbolicLink: item.isSymbolicLink(),
          collapsed: true,
          ...(item.isSymbolicLink() && { linkTo: symLink }),
        });
      }
      resolve(dirArray);
    });
  });
}

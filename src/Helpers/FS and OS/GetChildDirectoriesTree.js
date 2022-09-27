const fs = window.require("fs");

export default function getChildDirectoriesTree(location) {
  const directoryChildren = fs
    .readdirSync(location, { withFileTypes: true })
    .map((item) => {
      if (
        (item.name === "temp" ||
          item.name === "System Volume Information" ||
          item.name.startsWith("$")) &&
        location.length === 3
      ) {
        return "";
      }
      let permission = true;
      try {
        fs.statSync(`${location}/${item.name}`);
      } catch {
        permission = false;
      }
      let symLink;
      if (item.isSymbolicLink()) {
        symLink = fs.readlinkSync(location + "/" + item.name);
        symLink = symLink.replaceAll("\\", "/");
      }

      if (item.isDirectory() || item.isSymbolicLink()) {
        return {
          location: location + item.name + "/",
          name: item.name,
          permission: permission,
          isDirectory: item.isDirectory(),
          collapsed: true,
          isPartOfTree: true,
          ...(item.isSymbolicLink() && {
            linkTo: symLink,
            isSymbolicLink: true,
          }),
        };
      }
      return "";
    })
    .filter((item) => {
      return item && item;
    });

  return directoryChildren;
}

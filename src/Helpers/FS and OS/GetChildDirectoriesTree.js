const fs = window.require("fs");

export default function getChildDirectoriesTree(location) {
  const directoryChildren = fs
    .readdirSync(location, { withFileTypes: true })
    .map((item) => {
      return getTreeItem(location, item);
    })
    .filter((item) => {
      return item && item;
    });

  return directoryChildren;
}

export function getTreeItem(location, item) {
  const { name } = item;
  if (
    (name.toLowerCase() === "system volume information" ||
      name.toLowerCase() === "trash") &&
    location.length === 3
  ) {
    return "";
  }
  if (name.startsWith("$")) {
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
      path: location + item.name + "/",
      name: item.name,
      permission: permission,
      isDirectory: item.isDirectory(),
      collapsed: true,
      ...(item.isSymbolicLink() && {
        linkTo: symLink,
        isSymbolicLink: true,
      }),
    };
  }
  return "";
}

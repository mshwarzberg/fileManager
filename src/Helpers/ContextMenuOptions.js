export default function contextMenuOptions(item) {
  if (!item) {
    return JSON.stringify([
      "View",
      "Sort By",
      "New Folder",
      "Paste",
      "Show In Explorer",
      "Refresh",
      "Properties",
    ]);
  }
  const { isDirectory, isDrive, isFile, permission } = item;
  if (!permission) {
    return JSON.stringify([]);
  }
  if (isDirectory) {
    return JSON.stringify([
      "Open",
      "Rename",
      "Cut",
      "Copy",
      "Paste",
      "Delete",
      "Show In Explorer",
      "Properties",
    ]);
  } else if (isDrive) {
    return JSON.stringify(["Open", "Show In Explorer", "Properties"]);
  } else if (isFile) {
    return JSON.stringify([
      "Open",
      "Rename",
      "Cut",
      "Copy",
      "Delete",
      "Show In Explorer",
      "Properties",
    ]);
  }
}

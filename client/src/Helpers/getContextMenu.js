export default function getContextMenu(isDirectory, permission) {
  if (!permission) {
    return null;
  }
  if (isDirectory) {
    return ["rename", "cutcopy", "paste", "delete", "explorer", "properties"];
  }
  return ["rename", "cutcopy", "delete", "properties", "explorer"];
}

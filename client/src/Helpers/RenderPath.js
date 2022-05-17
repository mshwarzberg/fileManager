import ParentDirectoriesToArray from "./ParentDirectoriesToArray";

export function RenderPath(name, path, folderPath) {
  let parentArr = ParentDirectoriesToArray(path);
  let comparePath = folderPath;
  comparePath = comparePath.split("/").slice(2, comparePath.length);
  if (
    parentArr.indexOf(name) ===
    comparePath.indexOf(name)
  ) {
    return true;
  }
  if (name === "") {
    return true;
  }
  return false;
}

export function IsLastInArray(path, name) {
  
  path = path.split('/')
  if (name === path[path.length - 1]) {
    return true
  }
  return false
}
import ParentDirectoriesToArray from "./ParentDirectoriesToArray";

export function RenderPath(name, path, folderPath) {
  let parentArr = ParentDirectoriesToArray(path);
  parentArr.unshift('')
  folderPath = folderPath.split("/").slice(2, folderPath.length);
  
  if (
    parentArr.indexOf(name) ===
    folderPath.indexOf(name)
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
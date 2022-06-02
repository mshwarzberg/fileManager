import ParentDirectoriesToArray from "./ParentDirectoriesToArray";

export function IsInPath(name, path, folderPath) {
  let parentArr = ParentDirectoriesToArray(path)
  folderPath = folderPath.split("/")
  folderPath.shift()
  
  if (
    parentArr.indexOf(name) ===
    folderPath.indexOf(name) && parentArr.indexOf(name) !== -1
    ) {
    return true;
  }
  if (name === "") {
    return true;
  }
  return false;
}
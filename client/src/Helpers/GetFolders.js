
export default function GetFolders(array) {
  let folders = [];
  for (let i = 0; i < array.length; i++) {
    if (array[i].itemtype === "folder") {
      folders.push(array[i].name);
    }
  }
  return folders;
}

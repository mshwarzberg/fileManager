export default function ParentDirectoriesToArray(path) {
  path = path.split("/");
  if (path[0] === "") {
    path = path.slice(1, path.length);
  }
  return path
}
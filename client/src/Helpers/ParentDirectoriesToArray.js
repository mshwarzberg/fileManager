export default function ParentDirectoriesToArray(path) {
  let [drive, restOfPath] = path.split(":");
  let restOfPathArray = [];
  drive += ":";
  path = restOfPath?.split("/");
  if (typeof path === "object") {
    for (let i of path) {
      if (i !== "") {
        restOfPathArray.push(i);
      }
    }
  }
  return ["", drive, ...restOfPathArray];
}

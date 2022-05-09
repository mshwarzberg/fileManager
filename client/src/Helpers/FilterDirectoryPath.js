export default function FilterDirectoryPath(path) {
  for (let i = 0; i < path.length;i++) {
    if (path[i] === '/' || path[i] === '\\') {
      console.log(path[i]);
      if (path[i+1] === '/' || path[i + 1] === '\\') {
        console.log(path[i+1]);
        path = path.replace(path[i], '')
      }
    }
  }
  console.log(path)
}
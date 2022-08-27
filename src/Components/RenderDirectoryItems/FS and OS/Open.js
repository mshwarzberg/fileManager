const { exec } = window.require("child_process");

export default function Open(path) {
  path = path.split("");
  for (let i in path) {
    if (path[i] === "/") {
      path.splice(i, 1, '"/"');
    }
    if (path[i - 1] === ":") {
      path.splice(i, 1, '/"');
    }
  }
  try {
    exec(`cmd /c "start ${path.join("")}""`);
  } catch (e) {
    return console.log(e);
  }
}

export function OpenWithExplorer(path, isFile) {
  path = path.replaceAll("/", "\\");
  console.log(path);
  try {
    exec(`explorer.exe ${isFile ? `/select, ${path}` : path}`);
  } catch (e) {
    console.log(e.toString());
  }
}

export default function ColorizeIcons(fileextension) {
  fileextension = fileextension.toLowerCase();

  switch (fileextension) {
    case "jpg":
      return "#ff0000";
    case "mp4":
      return "blue";
    case "mkv":
      return "#000022";
    case "json":
      return "#878372";
    case "txt":
      return "teal";
    case "rtf":
      return "#938aed";
    case "png" || "apng":
      return "#ff6e6e";
    case "avi":
      return "#3223a5";
    case "wmv":
      return "#878372";
    case "xhtml":
    case "html":
      return "#ffa500";
    case "db":
      return "#775832";
    case "7z":
    case "zip":
      return "pink";
    case "xcf":
      return "green";
    case "ion":
      return "#210323";
    case "gif":
      return "white";
    case "ts":
    case "tsx":
    case "cjs":
    case "jsx":
    case "js":
      return "rebeccapurple";
    case "scss":
    case "css":
      return "lightgreen";
    case "exe":
    case "msi":
      return "navy";
    default:
      return "black";
  }
}

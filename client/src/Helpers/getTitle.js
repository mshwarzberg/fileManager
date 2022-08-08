import formatDuration from "./FormatVideoTime";
import FormatSize from "./FormatSize";

export default function getTitle(item) {
  const { itemtype, name, path, description, duration, size, width, height } =
    item;
  if (itemtype === "video" || itemtype === "image" || itemtype === "gif") {
    return `Name: ${name}\nPath: ${path}\nSize: ${
      FormatSize(size) || ""
    }\nDimensions: ${width + "x" + height}${
      duration > 0.1 ? `\nDuration: ${formatDuration(duration)}` : ""
    }${description ? `\nDescription: ${description}` : ""}`;
  }
  if (itemtype === "folder") {
    return `Name: ${name}\nPath: ${path}`;
  } else {
    return `Name: ${name}\nPath: ${path}\nSize: ${FormatSize(size) || ""}`;
  }
}

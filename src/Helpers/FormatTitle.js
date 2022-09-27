import formatVideoTime from "./FormatVideoTime";
import formatSize from "./FormatSize";

export default function formatTitle(item) {
  const {
    name,
    location,
    description,
    duration,
    size,
    width,
    height,
    isDrive,
    availableSpace,
    totalSize,
    isDirectory,
    isMedia,
  } = item;
  if (isMedia) {
    return `Name: ${name}\nLocation: ${location}\nSize: ${
      formatSize(size) || ""
    }\nDimensions: ${width + "x" + height}${
      duration > 0.1 ? `\nDuration: ${formatVideoTime(duration)}` : ""
    }${description ? `\nDescription: ${description}` : ""}`;
  } else if (isDirectory) {
    return `Name: ${name}\nLocation: ${location}`;
  } else if (isDrive) {
    return `Name: ${name}\nSpace Remaining: ${formatSize(
      availableSpace
    )}\nDrive Size: ${formatSize(totalSize)}`;
  } else {
    return `Name: ${name}\nLocation: ${location}\nSize: ${
      formatSize(size) || ""
    }`;
  }
}

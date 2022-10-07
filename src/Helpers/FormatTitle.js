import formatVideoTime from "./FormatVideoTime";
import formatSize from "./FormatSize";

export default function formatTitle(item, media = {}) {
  const {
    name,
    location,
    size,
    isDrive,
    availableSpace,
    totalSize,
    isDirectory,
    isMedia,
    path,
  } = item;

  const { headline, duration, description, width, height } = media;

  if (isMedia) {
    return `Name: ${name}\nLocation: ${location || path}\nSize: ${
      formatSize(size) || ""
    }\nDimensions: ${width + "x" + height}${
      duration ? `\nDuration: ${formatVideoTime(duration)}` : ""
    }${headline ? `\nHeadline: ${headline}` : ""}${
      description && typeof description === "string"
        ? `\nDescription: ${description}`
        : ""
    }`;
  } else if (isDrive) {
    return `Name: ${name}\nSpace Remaining: ${formatSize(
      availableSpace
    )}\nDrive Size: ${formatSize(totalSize)}`;
  } else {
    return `Name: ${name}\nLocation: ${
      location || path?.slice(0, path.length - name.length - 1)
    }${size ? `\nSize: ${formatSize(size)}` : ""}`;
  }
}

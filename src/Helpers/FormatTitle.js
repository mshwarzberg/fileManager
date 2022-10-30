import formatVideoTime from "./FormatVideoTime";
import formatSize from "./FormatSize";
import { intToBitRateStr } from "./FormatBitRate";

export default function formatTitle(item) {
  const {
    name,
    fileSystem,
    size,
    isDrive,
    availableSpace,
    displayName,
    displayLocation,
    isMedia,
    path,
    dimensions,
    headline,
    duration,
    description,
    bitrate,
  } = item;

  if (isMedia) {
    return `Name: ${displayName || name}\nLocation: ${
      displayLocation || path
    }\nSize: ${formatSize(size) || ""}${
      dimensions ? `\nDimensions: ${dimensions}` : ""
    }${duration ? `\nDuration: ${formatVideoTime(duration)}` : ""}${
      headline ? `\nHeadline: ${headline}` : ""
    }${description ? `\nDescription: ${description}` : ""}${
      bitrate ? `\nBit Rate: ${intToBitRateStr(bitrate)}` : ""
    }`;
  } else if (isDrive) {
    if (!size && !fileSystem) {
      return "Status: offline";
    }
    return `Name: ${name}\nFile System: ${fileSystem}\nSpace Remaining: ${formatSize(
      availableSpace
    )}\nDrive Size: ${formatSize(size)}`;
  } else {
    return `Name: ${displayName || name}\nLocation: ${
      displayLocation || path?.slice(0, path.length - name.length - 1)
    }${size ? `\nSize: ${formatSize(size)}` : ""}`;
  }
}

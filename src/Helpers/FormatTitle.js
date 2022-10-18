import formatVideoTime from "./FormatVideoTime";
import formatSize from "./FormatSize";
import { intToBitRateStr } from "./FormatBitRate";

export default function formatTitle(item) {
  const {
    name,
    location,
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
    return `Name: ${name}\nSpace Remaining: ${formatSize(
      availableSpace
    )}\nDrive Size: ${formatSize(size)}`;
  } else {
    return `Name: ${displayName || name}\nLocation: ${
      displayLocation || path?.slice(0, path.length - name.length - 1)
    }${size ? `\nSize: ${formatSize(size)}` : ""}`;
  }
}

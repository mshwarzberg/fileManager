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
    isFile,
    dimensions,
    headline,
    duration,
    description,
    bitrate,
    location,
    path,
  } = item;
  if (!name) {
    return "";
  }
  let title = `Name: ${displayName || name}\nLocation: ${
    displayLocation || location || path.slice(0, path.length - name.length - 1)
  }`;
  if (isFile) {
    if (size) {
      title += `\nSize: ${formatSize(size)}`;
    }
    if (dimensions) {
      title += `\nDimensions: ${dimensions}`;
    }
    if (duration) {
      title += `\nDuration: ${formatVideoTime(duration)}`;
    }
    if (headline) {
      title += `\nHeadline: ${headline}`;
    }
    if (description) {
      title += `\nDescription: ${description}`;
    }
    if (bitrate) {
      title += `\nBit Rate: ${intToBitRateStr(bitrate)}`;
    }
  }
  if (isDrive) {
    if (!size && !fileSystem) {
      return "Status: offline";
    }
    if (fileSystem) {
      title += `\nFile System: ${fileSystem}`;
    }
    if (availableSpace) {
      title += `\nSpace Remaining: ${formatSize(availableSpace)}`;
    }
    if (size) {
      title += `\nDrive Capacity: ${formatSize(size)}`;
    }
  }
  return title;
}

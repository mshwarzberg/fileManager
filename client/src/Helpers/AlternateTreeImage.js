import {
  Desktop,
  Documents,
  Downloads,
  Music,
  Pictures,
  Videos,
  Drive,
} from "../Assets/images/Tree Icons/index";

export default function alternateImage(name, boolean) {
  if (boolean) {
    if (name.includes(":")) {
      return Drive;
    }
    switch (name) {
      case "Downloads":
        return Downloads;
      case "Documents":
        return Documents;
      case "Desktop":
        return Desktop;
      case "Music":
        return Music;
      case "Pictures":
        return Pictures;
      case "Videos":
        return Videos;
      default:
        return;
    }
  }
  return;
}

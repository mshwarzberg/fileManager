import CheckType from "../../../Helpers/FS and OS Helpers/CheckType";
import { ffprobeMetadata } from "../../../Helpers/FS and OS Helpers/FFmpegFunctions";

export default function getMediaMetadata(currentdirectory, name) {
  return new Promise((resolve, _) => {
    if (
      CheckType(name)[0] === "video" ||
      CheckType(name)[0] === "gif" ||
      CheckType(name)[0] === "image"
    ) {
      ffprobeMetadata(`${currentdirectory}${name}`, (data) => {
        return resolve(data);
      });
    } else {
      return;
    }
  });
}

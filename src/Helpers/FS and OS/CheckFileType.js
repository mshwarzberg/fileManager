export default function checkFileType(fileextension) {
  fileextension = fileextension.split(".")[1];
  switch (fileextension) {
    case "jpg":
    case "png":
    case "jpeg":
    case "apng":
      return "image";
    case "mp4":
    case "mkv":
    case "webm":
    case "avi":
    case "m4v":
    case "wmv":
      return "video";
    case "txt":
    case "rtf":
    case "ion":
    case "docx":
    case "json":
    case "jsx":
    case "js":
    case "scss":
    case "md":
    case "py":
    case "css":
    case "html":
    case "xhtml":
    case "ini":
      return "document";
    case "mp3":
    case "flac":
    case "wav":
    case "m4a":
    case "aac":
    case "wma":
      return "audio";
    case "gif":
      return "gif";
    default:
      return "unknown";
  }
}

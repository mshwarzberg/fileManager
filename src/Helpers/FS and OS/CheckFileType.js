export default function checkFileType(fullName) {
  if (!fullName) {
    return ["", ""];
  }
  let fileextension = "";
  for (let i = fullName.length - 1; i >= 0; i--) {
    if (fullName[i] !== "." && fileextension === "") {
      fileextension = fullName[i];
    } else if (fullName[i] !== ".") {
      fileextension = fullName[i] + fileextension;
    } else {
      break;
    }
  }
  if (fileextension) {
    fileextension = fileextension.toLowerCase();
  }

  const checkIfImage = [
    fileextension === "jpg",
    fileextension === "png",
    fileextension === "jpeg",
  ];
  const checkIfVideo = [
    fileextension === "mp4",
    fileextension === "mkv",
    fileextension === "webm",
    fileextension === "avi",
    fileextension === "wmv",
  ];

  const checkIfText = [
    fileextension === "txt",
    fileextension === "rtf",
    fileextension === "ion",
    fileextension === "docx",
    fileextension === "json",
    fileextension === "jsx",
    fileextension === "js",
    fileextension === "scss",
    fileextension === "md",
    fileextension === "py",
    fileextension === "css",
    fileextension === "html",
    fileextension === "xhtml",
    fileextension === "ini",
    fileextension === "lnk",
  ];

  let type;
  if (checkIfImage.includes(true)) {
    type = "image";
  } else if (checkIfVideo.includes(true)) {
    type = "video";
  } else if (fileextension === "gif") {
    type = "gif";
  } else if (checkIfText.includes(true)) {
    type = "document";
  } else {
    type = "unknown";
  }

  return [type, fileextension];
}

import folderIcon from "../Assets/images/folder.png";
import gifIcon from "../Assets/images/gif.png";
import videoIcon from "../Assets/images/film.png";
import documentIcon from "../Assets/images/document.png";
import imageIcon from "../Assets/images/image.png";
import unknownIcon from "../Assets/images/unknownfile.png";

import lightFolderIcon from "../Assets/images/folderhover.png";
import lightGifIcon from '../Assets/images/gifhover.png'
import lightVideoIcon from "../Assets/images/filmhover.png";
import lightDocumentIcon from "../Assets/images/documenthover.png";
import lightImageIcon from "../Assets/images/imagehover.png";
import lightUnknownIcon from "../Assets/images/unknownfilehover.png";

export default function ChooseIcon(type, light) {
  
  if (type === "gif") {
    return light ? lightGifIcon : gifIcon ;
  }
  if (type === "video") {
    return light ? lightVideoIcon : videoIcon;
  }
  if (type === "image") {
    return light ? lightImageIcon : imageIcon;
  }
  if (type === "document") {
    return light ? lightDocumentIcon : documentIcon;
  }
  if (type === "unknown") {
    return light ? lightUnknownIcon : unknownIcon;
  }
  if (type === "folder") {
    return light ? lightFolderIcon : folderIcon;
  }
};
import { useEffect } from "react";
import folder from "../Assets/images/folder.png";
import symlink from "../Assets/images/symlink.png";
import close from "../Assets/images/close.png";
import alert from "../Assets/images/alert.png";
import drive from "../Assets/images/drive.png";

export function toDataURL(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = () => {
    var reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(xhr.response);
  };
  xhr.open("GET", url);
  xhr.responseType = "blob";
  xhr.send();
}
export default function useStoreImages() {
  useEffect(() => {
    if (navigator.userAgent.includes("Firefox")) {
      sessionStorage.clear();
    }
    if (!localStorage.getItem("foldericon")) {
      localStorage.setItem("folder", folder);
    }
    if (!localStorage.getItem("symlinkicon")) {
      toDataURL(symlink, function (dataUrl) {
        localStorage.setItem("symlinkicon", dataUrl);
      });
    }
    if (!localStorage.getItem("closeicon")) {
      toDataURL(close, function (dataUrl) {
        localStorage.setItem("closeicon", dataUrl);
      });
    }
    if (!localStorage.getItem("alerticon")) {
      toDataURL(alert, function (dataUrl) {
        localStorage.setItem("alerticon", dataUrl);
      });
    }
    if (!localStorage.getItem("driveicon")) {
      localStorage.setItem("driveicon", drive);
    }
  }, []);
}

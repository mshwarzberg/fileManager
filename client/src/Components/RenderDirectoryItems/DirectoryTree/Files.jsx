import React from "react";
import playIcon from "../../../Assets/images/play.png";
import imageIcon from "../../../Assets/images/image.png";
import documentIcon from "../../../Assets/images/document.png";
import unknownIcon from "../../../Assets/images/unknown.png";
import notAllowedIcon from "../../../Assets/images/notallowed.png";

export default function Files({ child }) {
  const { name, path, itemtype, permission } = child;

  function displayIcon() {
    if (!permission) {
      return (
        <img src={notAllowedIcon} alt="play video" className="side--icon" />
      );
    }
    if (itemtype === "video") {
      return <img src={playIcon} alt="play video" className="side--icon" />;
    } else if (itemtype === "image") {
      return <img src={imageIcon} alt="play video" className="side--icon" />;
    } else if (itemtype === "document") {
      return <img src={documentIcon} alt="play video" className="side--icon" />;
    } else if (!itemtype || itemtype === "unknown") {
      return <img src={unknownIcon} alt="play video" className="side--icon" />;
    }
  }
  return (
    <div
      className={`tree--file ${!permission ? "no-permission" : ""}`}
      onClick={() => {
        fetch("/api/manage/open", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: path,
          }),
        });
      }}
      data-info={permission ? JSON.stringify(child) : null}
    >
      {displayIcon()}
      {name}
    </div>
  );
}

import React from "react";
import { colorizeIcons, colorIconText } from "../../../Helpers/ColorizeIcons";

export default function CustomIcon({ fileextension }) {
  let margin, size;
  if (fileextension.length < 4) {
    size = "2.2rem";
    margin = "30%";
  } else if (fileextension.length < 7) {
    size = "1.7rem";
    margin = "25%";
  } else {
    size = "0";
    margin = "0";
  }
  return (
    <div className="custom-icon-container">
      <div className="custom-icon-body">
        <div className="triangle" />
        <div className="bar-top" />
        <div className="bar-bottom" />
      </div>
      <div
        className="file-extension-container"
        style={{ backgroundColor: colorizeIcons(fileextension) }}
      >
        <p
          style={{
            color: colorIconText(colorizeIcons(fileextension)),
            fontSize: size,
            marginTop: margin,
          }}
        >
          {fileextension.toUpperCase()}
        </p>
      </div>
    </div>
  );
}

import React from "react";
import { colorizeIcons, colorIconText } from "../../../Helpers/ColorizeIcons";

export default function CustomIcon({ fileextension }) {
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
          className="file-extension"
          style={{
            color: colorIconText(colorizeIcons(fileextension)),
          }}
        >
          {fileextension.toUpperCase()}
        </p>
      </div>
    </div>
  );
}

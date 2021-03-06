import React from "react";
import ColorizeIcons from "../../../../Helpers/ColorizeIcons";

export default function CustomIcon({ fileextension }) {
  return (
    <svg
      viewBox="0 0 100 100"
      style={{ position: "absolute" }}
      className="svg--icon"
    >
      <rect
        fill="#bbbbbb"
        x="12.5"
        y="-5"
        width="75"
        height="100"
        clipPath="polygon(100% 0, 100% 75%, 69% 100%, 0 100%, 0 0)"
        className="svg--icon"
      />
      <rect
        x="4.5"
        y="20"
        width="50"
        height="25"
        fill={ColorizeIcons(fileextension)}
        rx="1"
        ry="1"
        className="svg--icon"
      />
      <rect
        width="25"
        height="25"
        fill="white"
        y="70"
        x="63.8"
        clipPath="polygon(0 0, 0% 100%, 94% 0)"
        className="svg--icon"
      />
      <rect
        width="25"
        height="25"
        fill="#9f9f9f"
        y="70"
        x="38.8"
        clipPath="polygon(100% 0, 0% 100%, 100% 100%)"
        className="svg--icon"
      />
      <text
        fill={
          ColorizeIcons(fileextension) === "white" ||
          ColorizeIcons(fileextension) === "yellow"
            ? "black"
            : "white"
        }
        x="30"
        y={fileextension.length > 4 ? "36" : "40"}
        className="custom-icon-text"
        style={{
          fontSize: fileextension.length > 4 ? "0.6em" : "1.3em",
        }}
      >
        {fileextension.toUpperCase()}
      </text>
    </svg>
  );
}

import React from "react";
import {
  colorizeIcons,
  colorIconText,
} from "../../../../Helpers/ColorizeIcons";

export default function CustomFileIcon({
  fileextension = "",
  viewBox = 105,
  x = -2.5,
  y = 5,
}) {
  return (
    <svg viewBox={`${x} ${y} ${viewBox} ${viewBox}`}>
      <rect
        fill="#bbb"
        clipPath="polygon(70% 0%, 100% 25%, 100% 100%, 0% 100%, 0% 0%)"
        width="67.5"
        height="90"
        x="16.25"
        rx="3"
        y="8"
      />
      <rect
        width="67.5"
        fill="#bbb"
        height={67.5}
        x={16.25}
        y="30"
        rx={3}
        style={{ filter: "drop-shadow( 2px 3px 1px rgba(0, 0, 0, 0.7))" }}
      />
      <rect
        fill="#444"
        clipPath="polygon(0 10%, 0% 100%, 90% 100%)"
        width="22.5"
        height="25"
        x="63.5"
        y="5.3"
        ry="3"
      />
      <rect fill="#444" width="55" height="4" x="22" y="47.5" rx="2" />
      <rect fill="#444" width="55" height="4" x="22" y="56.5" rx="2" />
      <rect
        fill={colorizeIcons(fileextension)}
        width="76"
        height="25"
        rx="2"
        x="12"
        y="65.5"
        style={{
          filter: `drop-shadow( 1px 1px 1px ${colorizeIcons(fileextension)})`,
        }}
      />
      <text
        fill={colorIconText(colorizeIcons(fileextension))}
        x="50"
        y="86"
        style={{
          textAnchor: "middle",
          fontFamily: "bebas neue",
          letterSpacing: "0.8px",
          fontSize: "1.4rem",
        }}
      >
        {fileextension.toUpperCase()}
      </text>
    </svg>
  );
}

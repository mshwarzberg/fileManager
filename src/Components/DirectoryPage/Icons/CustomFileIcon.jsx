import React from "react";
import { colorizeIcons, colorIconText } from "../../../Helpers/ColorizeIcons";

export default function CustomFileIcon({
  fileextension = "",
  viewBox = 110,
  x = 0,
  y = 0,
}) {
  return (
    <svg viewBox={`${x} ${y} ${viewBox} ${viewBox - 10}`}>
      <rect
        fill="#bbb"
        clipPath="polygon(70% 0%, 100% 25%, 100% 100%, 0% 100%, 0% 0%)"
        width="67.5"
        height="90"
        x="22"
        rx="3"
        y="8"
      />
      <rect
        fill="#444"
        clipPath="polygon(0 10%, 0% 100%, 90% 100%)"
        width="22.5"
        height="25"
        x="69"
        y="5.3"
        ry="3"
      />
      <rect fill="#444" width="55" height="4" x="28" y="47.5" rx="2" />
      <rect fill="#444" width="55" height="4" x="28" y="56.5" rx="2" />
      <rect
        fill={colorizeIcons(fileextension)}
        width="76"
        height="25"
        rx="2"
        x="17.5"
        y="65.5"
        style={{
          filter: `drop-shadow( 2px 2px 0.3rem ${colorizeIcons(
            fileextension
          )})`,
        }}
      />
      <text
        fill={colorIconText(colorizeIcons(fileextension))}
        x="55"
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

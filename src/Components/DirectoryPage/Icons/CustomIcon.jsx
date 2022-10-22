import React from "react";
import { colorizeIcons, colorIconText } from "../../../Helpers/ColorizeIcons";

export default function CustomIcon({ fileextension }) {
  return (
    <svg viewBox="0 0 100 100">
      <rect
        fill="#bbb"
        clipPath="polygon(70% 0%, 100% 25%, 100% 100%, 0% 100%, 0% 0%)"
        width="67.5"
        height="90"
        x="16"
        rx="3"
      />
      <rect
        fill="#444"
        clipPath="polygon(0 10%, 0% 100%, 90% 100%)"
        width="22.5"
        height="25"
        x="63.5"
        y="-2.5"
        ry="3"
      />
      <rect fill="#444" width="55" height="4" x="22.5" y="39.5" rx="2" />
      <rect fill="#444" width="55" height="4" x="22.5" y="48.5" rx="2" />
      <rect
        fill={colorizeIcons(fileextension)}
        width="76"
        height="25"
        rx="2"
        x="12"
        y="57.5"
      />
      <text
        fill={colorIconText(colorizeIcons(fileextension))}
        x="50"
        y="77.5"
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

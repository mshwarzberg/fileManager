import React, { useRef } from "react";

export default function Filename(props) {
  const svgText = useRef();
  const svgBody = useRef();

  return (
    <svg
      style={{ position: "absolute", bottom: "1%" }}
      ref={svgBody}
      viewBox="0 0 150 15"
      onClick={(e) => {
        e.stopPropagation();
      }}
      data-title={props.name.length > 30 ? props.name : null}
    >
      <text
        ref={svgText}
        x={props.name.length < 30 ? 75 : 5}
        y="10"
        style={{
          fontSize: "0.75em",
          fontFamily: "akshar",
          ...(props.name.length < 30 && { textAnchor: "middle" }),
        }}
        fill="white"
      >
        {props.name}
      </text>
    </svg>
  );
}

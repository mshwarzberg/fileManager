import React, { useRef } from "react";

export default function Filename(props) {
  const svgText = useRef();
  const svgBody = useRef();
  let { name } = props;
  if (name.length > 30) {
    name = name.slice(0, 27) + "...";
  }
  return (
    <svg
      style={{ position: "absolute", bottom: "1%" }}
      ref={svgBody}
      viewBox="0 0 150 15"
      data-title={props.name.length > 30 ? props.name : null}
    >
      <text
        ref={svgText}
        x={name.length < 30 ? 75 : 5}
        y="10"
        style={{
          fontSize: "0.75em",
          fontFamily: "akshar",
          ...(name.length < 30 && { textAnchor: "middle" }),
          textOverflow: "ellipsis",
        }}
        fill="white"
      >
        {name}
      </text>
    </svg>
  );
}

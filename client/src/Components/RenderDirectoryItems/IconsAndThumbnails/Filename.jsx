import React, { useRef } from "react";

let IntervalAnimation;
export default function Filename(props) {
  const svgText = useRef();
  const svgBody = useRef();
  return (
    <svg
      style={{ position: "absolute", bottom: "1%" }}
      ref={svgBody}
      viewBox="0 0 150 15"
      onMouseEnter={() => {
        if (svgBody.current && props.name.length > 25) {
          svgText.current.style.textAnchor = "";
          svgText.current.x.baseVal[0].value = 145;
          IntervalAnimation = setInterval(() => {
            if (svgText.current) {
              svgText.current.x.baseVal[0].value -= 1;
            }
          }, 16);
        }
      }}
      onMouseLeave={() => {
        clearInterval(IntervalAnimation);
        if (props.name.length < 25) {
          svgText.current.style.textAnchor = "middle";
          svgText.current.x.baseVal[0].value = 75;
        } else {
          svgText.current.x.baseVal[0].value = 5;
        }
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <text
        ref={svgText}
        x={props.name.length < 30 ? 75 : 5}
        y="10"
        style={{
          fontSize: "0.75em",
          ...(props.name.length < 30 && { textAnchor: "middle" }),
          fontFamily: "akshar",
        }}
        fill="white"
      >
        {props.name}
      </text>
    </svg>
  );
}

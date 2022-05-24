import React, { useRef } from "react";

let IntervalAnimation
export default function Filename(props) {
  const svgBody = useRef();
  const svgText = useRef();

  return (
    <svg
    style={{position: 'absolute', bottom: '1%'}}
      ref={svgBody}
      viewBox="0 0 150 102"
      onMouseEnter={() => {
        if (svgBody.current && props.name.length > 25) {
          svgText.current.style.textAnchor = "";
          svgText.current.x.baseVal[0].value = 145;
          IntervalAnimation = setInterval(() => {
            svgText.current.x.baseVal[0].value -= 1;
          }, 15);
        }
      }}
      onMouseLeave={() => {
        clearInterval(IntervalAnimation);
        svgText.current.style.textAnchor = "middle";
        svgText.current.x.baseVal[0].value = 75;
      }}
    >
      <text
        ref={svgText}
        x="75"
        y="99"
        style={{ fontSize: "0.75em", textAnchor: "middle" }}
        fill="white"
      >
        {props.name}
      </text>
    </svg>
  );
}

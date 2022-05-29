import React, { useEffect, useState, useRef } from "react";
import uparrow from "../../Assets/images/up-arrow-white.png";
import downarrow from "../../Assets/images/down-arrow-white.png";

export default function Scrollbar(props) {

  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const [scrollerHeight, setScrollerHeight] = useState(0);
  const [scrollerPosition, setScrollerPosition] = useState(0);

  let totalElementY = props.element?.scrollHeight
  let visibleElementY = props.element?.clientHeight;
  let screenX = props.element?.clientWidth;
  let pixelRatio = window.devicePixelRatio;
  
  const ScrollerPiece = useRef()
  useEffect(() => {
    if (props.element) {
      window.addEventListener("resize", () => {
        let screenX = props.element?.clientWidth;
        const adjustedWidth = 1800 / screenX;
        setScrollbarWidth(adjustedWidth);
      });
      props.element.addEventListener("scroll", () => {
        let scrollTop = props.element?.scrollTop
        const adjustedWidth = 1800 / screenX;
        setScrollbarWidth(adjustedWidth);
        setScrollerPosition(scrollTop + (scrollTop * visibleElementY / totalElementY))
        setScrollerHeight((visibleElementY / totalElementY) * visibleElementY);
      });
    }
    return () => {
      props.element?.removeEventListener("scroll", () => {});
      window.removeEventListener("resize", () => {});
    };
  });
  
  return (
      <div
        id="scrollbar--body"
        style={{
          height: totalElementY,
          width: scrollbarWidth + "%",
        }}
      >
        <div id="arrow--up">
          <img src={uparrow} alt="up" />
        </div>
        <div
          id="scrollbar--track"
        >
          <div
            ref={ScrollerPiece}
            id="scrollbar--piece"
            style={{
              height: scrollerHeight + 'px',
              top: scrollerPosition + 'px'
            }}
          />
        </div>
        <div id="arrow--down">
          <img src={downarrow} alt="down" />
        </div>
      </div>
  )
}

import React, { useEffect, useState, useRef } from "react";
import uparrow from "../../Assets/images/up-arrow-white.png";
import downarrow from "../../Assets/images/down-arrow-white.png";

export default function Scrollbar(props) {

  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const [scrollerHeight, setScrollerHeight] = useState(0);
  const [scrollerPosition, setScrollerPosition] = useState(0);

  let scrollTop = props.element?.scrollTop
  let totalScreenY = props.element?.scrollHeight
  let visibleScreenY = props.element?.clientHeight;
  let screenX = props.element?.clientWidth;
  let pixelRatio = window.devicePixelRatio;

  const ScrollerPiece = useRef()
  useEffect(() => {
    window.addEventListener("resize", () => {
      let screenX = props.element?.clientWidth;
      let pixelRatio = window.devicePixelRatio;
      const adjustedWidth = 1800 / (screenX / pixelRatio) / pixelRatio;
      setScrollbarWidth(adjustedWidth);
    });
    props.element?.addEventListener("scroll", (e) => {
      ScrollerPiece.current.style.top = scrollTop + (scrollTop * visibleScreenY / totalScreenY)
      const adjustedWidth = 1800 / screenX;
      setScrollbarWidth(adjustedWidth);
      setScrollerPosition(scrollTop + (scrollTop * visibleScreenY / totalScreenY))
      // console.log(scrollTop + (scrollTop * visibleScreenY / totalScreenY));
      setScrollerHeight((visibleScreenY / totalScreenY) * visibleScreenY);
    });
    return () => {
      props.element?.removeEventListener("scroll", () => {});
      window.removeEventListener("resize", () => {});
    };
  });
  
  return (
      <div
        id="scrollbar--body"
        style={{
          height: props.element?.scrollHeight,
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

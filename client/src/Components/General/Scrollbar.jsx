import React, { useEffect, useState } from "react";
import uparrow from "../../Assets/images/up-arrow-white.png";
import downarrow from "../../Assets/images/down-arrow-white.png";

export default function Scrollbar() {
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const [scrollerHeight, setScrollerHeight] = useState(0);
  const [scrollerPosition, setScrollerPosition] = useState(0);

  useEffect(() => {
    window.addEventListener("resize", () => {
      let screenX = document.body.clientWidth;
      let pixelRatio = window.devicePixelRatio;
      const adjustedWidth = 1800 / (screenX / pixelRatio) / pixelRatio;
      setScrollbarWidth(adjustedWidth);
    });
    document.body.addEventListener("scroll", () => {

      let scrollTop = document.body.scrollTop
      let totalScreenY = document.body.scrollHeight
      let visibleScreenY = document.body.clientHeight;
      let screenX = document.body.clientWidth;
      let pixelRatio = window.devicePixelRatio;

      const adjustedWidth = 1800 / (screenX / pixelRatio) / pixelRatio;
      setScrollbarWidth(adjustedWidth);
      // setScrollerPosition(totalScreenY / scrollTop)
      setScrollerHeight((visibleScreenY / totalScreenY) * 100);
    });
    return () => {
      document.body.removeEventListener("scroll", () => {});
      window.removeEventListener("resize", () => {});
    };
  });

  return (
      <div
        id="scrollbar--body"
        style={{
          height: "100%",
          width: scrollbarWidth + "%",
        }}
      >
        <div id="arrow--up">
          <img src={uparrow} alt="up" />
        </div>
        <div
          id="scrollbar--track"
          style={{
            height: 100 - scrollbarWidth + "%",
            top: scrollbarWidth + "%",
          }}
        >
          <div
            id="scrollbar--piece"
            style={{
              width: scrollbarWidth + '%',
              height: scrollerHeight + "%",
              marginTop: scrollerPosition,
              // display: 'none'
            }}
          />
        </div>
        <div id="arrow--down">
          <img src={downarrow} alt="down" />
        </div>
      </div>
  )
}

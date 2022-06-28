import React, { useRef, useState } from "react";
import useDrag from "../../../Hooks/useDrag";

import playIcon from "../../../Assets/images/play.png";
import formatDuration from "../../../Helpers/FormatVideoTime";
import Filename from "./Icon/Filename";

function Video(props) {
  const { item, index, getTitle } = props;

  const nameInput = useRef();
  const blockRef = useRef();

  const { XY, setIsDragging } = useDrag(blockRef.current, false, true);
  const { name, thumbnail, duration, path, permission } = item;

  const [durationPosition, setDurationPosition] = useState({
    rectX: 0,
    rectY: 0,
    textX: 0,
    textY: 0,
  });

  function positionDuration(x, y) {
    setDurationPosition({
      rectX: (100 + x) / 2 - 25,
      rectY: (100 + y) / 2 - 10,
      textX: (100 + x) / 2 - 12.5,
      textY: (100 + y) / 2 - 2,
    });
  }

  return (
    thumbnail && (
      <div
        data-srcpath={path}
        data-name={name}
        className="renderitem--block"
        onMouseEnter={(e) => {
          e.currentTarget.firstChild.style.display = "block";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.firstChild.style.display = "none";
        }}
        style={{
          cursor: !permission ? "not-allowed" : "pointer",
          backgroundColor: !permission ? "#ff7878c5" : "",
          border: !permission ? "1.5px solid red" : "",
          opacity: !permission ? 0.5 : "",
          ...((XY.x || XY.y) && {
            top: XY.y,
            left: XY.x,
            zIndex: 100,
            pointerEvents: "none",
            backgroundColor: "black",
            border: "2px solid pink",
          }),
        }}
        ref={blockRef}
        onMouseDown={(e) => {
          if (e.button === 0) {
            setIsDragging(true);
            e.stopPropagation();
            return;
          }
        }}
      >
        <img
          src={playIcon}
          alt="playvideo"
          className="renderitem--play-icon"
          style={{ display: "none", zIndex: 1 }}
          data-index={index}
          data-permission={permission}
          data-title={getTitle()}
        />
        <img
          style={{
            cursor: !permission ? "not-allowed" : "pointer",
          }}
          className="renderitem--thumbnail"
          data-index={index}
          data-permission={permission}
          data-title={getTitle()}
          src={thumbnail}
          alt="gifthumb"
          onLoad={(e) => {
            const currentThumbWidth =
              e.currentTarget.getBoundingClientRect().width;
            const currentThumbHeight =
              e.currentTarget.getBoundingClientRect().height;
            const currentContainerWidth =
              e.currentTarget.parentElement.getBoundingClientRect().width;
            const currentContainerHeight =
              e.currentTarget.parentElement.getBoundingClientRect().height;

            const X =
              (currentThumbWidth / currentContainerWidth) * 100 +
              0.7 * (currentThumbWidth / currentContainerWidth);
            const Y =
              (currentThumbHeight / currentContainerHeight) * 100 +
              15 * (currentThumbHeight / currentContainerHeight);

            positionDuration(X, Y);
          }}
        />
        {durationPosition.rectX && durationPosition.rectY && (
          <svg
            viewBox="0 0 100 100"
            style={{ zIndex: 1, pointerEvents: "none" }}
          >
            <rect
              fill="#000000de"
              width="25%"
              height="10%"
              x={durationPosition.rectX}
              y={durationPosition.rectY}
            />
            <text
              fill="white"
              style={{
                fontSize: "0.5em",
                textAnchor: "middle",
                fontFamily: "akshar",
              }}
              x={durationPosition.textX}
              y={durationPosition.textY}
            >
              {formatDuration(duration)}
            </text>
          </svg>
        )}
        <Filename name={name} nameRef={nameInput} />
      </div>
    )
  );
}

export default Video;

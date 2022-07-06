import React, { useState } from "react";

import playIcon from "../../../Assets/images/play.png";
import formatDuration from "../../../Helpers/FormatVideoTime";
import Filename from "./Icon/Filename";

function Video(props) {
  const { name, thumbnail, duration, permission } = props.item;

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
        className="block-container"
        onMouseDown={(e) => {
          if (e.button === 0) {
            // setIsDragging(true);
            e.stopPropagation();
            return;
          }
        }}
      >
        <img src={playIcon} alt="playvideo" className="renderitem--play-icon" />
        <img
          style={{
            cursor: !permission ? "not-allowed" : "pointer",
          }}
          className="renderitem--thumbnail"
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
        <Filename name={name} />
      </div>
    )
  );
}

export default Video;

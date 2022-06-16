import React, { useRef, useState } from "react";

import playIcon from "../../../Assets/images/play.png";
import PlayIconHover from "../../../Assets/images/playhover.png";
import formatDuration from "../../../Helpers/FormatVideoTime";
import Filename from "./Icon/Filename";

function Video(props) {
  const { item, index } = props;

  const nameInput = useRef();

  const {
    name,
    formattedSize,
    thumbnail,
    itemtype,
    height,
    width,
    duration,
    path,
    permission,
  } = item;

  const [durationPosition, setDurationPosition] = useState({
    rectX: 0,
    rectY: 0,
    textX: 12.5,
    textY: 8,
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
    thumbnail &&
    itemtype === "video" && (
      <>
        <div
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
            opacity: !permission ? 0.5 : 1,
          }}
        >
          <img
            src={playIcon}
            onMouseEnter={(e) => {
              e.currentTarget.src = PlayIconHover;
              e.stopPropagation();
            }}
            onMouseLeave={(e) => {
              e.currentTarget.src = playIcon;
            }}
            alt="playvideo"
            className="renderitem--play-icon"
            style={{ display: "none", zIndex: 1 }}
            data-index={index}
            data-permission={permission}
          />
          <img
            style={{
              cursor: !permission ? "not-allowed" : "pointer",
            }}
            className="renderitem--thumbnail"
            data-index={index}
            data-permission={permission}
            src={thumbnail}
            alt="gifthumb"
            title={`Name: ${name}\nSize: ${formattedSize}\nDimensions: ${width}x${height}\nDuration: ${formatDuration(
              duration
            )}\nPath: ${path}`}
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
          <Filename name={name} nameRef={nameInput} />
        </div>
      </>
    )
  );
}

export default Video;

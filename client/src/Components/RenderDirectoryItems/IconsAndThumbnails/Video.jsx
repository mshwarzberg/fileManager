import React, { useRef, useState } from "react";
import { useEffect } from "react";

import playIcon from "../../../Assets/images/play.png";
import PlayIconHover from "../../../Assets/images/playhover.png";
import formatDuration from "../../../Helpers/FormatVideoTime";
import Filename from "./Filename";

function Video(props) {
  const { item } = props;

  const container = useRef();
  const thumbnailItem = useRef();
  const nameInput = useRef();

  const {
    name,
    shorthandsize,
    fileextension,
    thumbnail,
    itemtype,
    height,
    width,
    duration,
    path,
  } = item;

  let positionX =
    (thumbnailItem?.current?.clientWidth / container?.current?.clientWidth) *
      100 +
    0.7 *
      (thumbnailItem?.current?.clientWidth / container?.current?.clientWidth);

  let positionY =
    (thumbnailItem?.current?.height / container?.current?.clientHeight) * 100 +
    15 * (thumbnailItem?.current?.height / container?.current?.clientHeight);

  const [durationPosition, setDurationPosition] = useState({
    rectX: 0,
    rectY: 0,
    textX: 12.5,
    textY: 8,
  });

  useEffect(() => {
    setDurationPosition({
      rectX: (100 + positionX) / 2 - 25 || 0,
      rectY: (100 + positionY) / 2 - 11 || 0,
      textX: (100 + positionX) / 2 - 12.5 || 12.5,
      textY: (100 + positionY) / 2 - 3 || 8,
    });
  }, [setDurationPosition, positionY, positionX]);
  return (
    thumbnail &&
    itemtype === "video" && (
      <>
        <div
          ref={container}
          className="renderitem--block"
          onMouseEnter={(e) => {
            e.currentTarget.firstChild.style.display = "block";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.firstChild.style.display = "none";
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
          />
          <img
            ref={thumbnailItem}
            className="renderitem--thumbnail"
            src={thumbnail}
            alt="gifthumb"
            title={`Name: ${name}\nSize: ${shorthandsize}\nType: ${fileextension}\nDimensions: ${width}x${height}\nDuration: ${formatDuration(
              duration
            )}\nPath: ${path}`}
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

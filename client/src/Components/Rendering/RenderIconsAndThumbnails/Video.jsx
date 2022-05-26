import React, { useRef, useState } from "react";
import { useEffect } from "react";

import playIcon from "../../../Assets/images/play.png";
import PlayIconHover from "../../../Assets/images/playhover.png";
import formatDuration from "../../../Helpers/FormatVideoTime";
import Filename from "./Filename";

function Video(props) {
  const { item, changeFolderOrViewFiles, directoryItems } = props;

  const container = useRef();
  const thumbnailItem = useRef();

  const {
    name,
    shorthandsize,
    fileextension,
    thumbnail,
    itemtype,
    height,
    width,
    duration,
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
    rectY:0,
    textX: 12.5,
    textY: 8,
  });

  useEffect(() => {
      setDurationPosition({
        rectX: (100 + positionX) / 2 - 25 || 0,
        rectY: (100 + positionY) / 2 - 11 || 0,
        textX: (100 + positionX) / 2 - 12.5 || 12.5,
        textY: (100 + positionY) / 2 - 3 || 8,
    })
  }, [setDurationPosition, positionY, positionX])
  return (
    thumbnail &&
    itemtype === "video" && (
      <div
        ref={container}
        className="renderfile--block"
        onClick={() => {
          return changeFolderOrViewFiles(
            itemtype,
            name,
            directoryItems.indexOf(item)
          );
        }}
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
          id="renderfile--play-icon"
          style={{ display: "none", zIndex: 1 }}
        />
        <img
          ref={thumbnailItem}
          id="renderfile--video-thumbnail"
          className="renderfile--thumbnail"
          src={thumbnail}
          alt="gifthumb"
          title={`Name: ${name}\nSize: ${shorthandsize}\nType: ${fileextension}\nDimensions: ${width}x${height}\nDuration: ${formatDuration(
            duration
          )}`}
        />
        <svg viewBox="0 0 100 100" style={{ zIndex: 1, pointerEvents: "none" }}>
          {/* <rect
            fill="#00000054"
            width={positionX + "%" || 0}
            height={positionY + "%" || 0}
            x={(100 - positionX) / 2}
            y={(100 - positionY) / 2}
            style={{ zIndex: 2 }}
          /> */}
          <rect
            fill="#000000de"
            width="25%"
            height="10%"
            x={durationPosition.rectX}
            y={durationPosition.rectY}
          />
          <text
            fill="white"
            style={{ fontSize: "0.5em", textAnchor: "middle" }}
            x={durationPosition.textX}
            y={durationPosition.textY}
          >
            {formatDuration(duration)}
          </text>
        </svg>
        <Filename name={name} />
      </div>
    )
  );
}

export default Video;

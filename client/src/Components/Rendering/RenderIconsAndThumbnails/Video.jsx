import React from "react";

import playIcon from "../../../Assets/images/play.png";
import PlayIconHover from "../../../Assets/images/playhover.png";
import formatDuration from "../../../Helpers/FormatVideoTime";
import Filename from "./Filename";

let abc
function Video(props) {
  const { item, changeFolderOrViewFiles, directoryItems } = props;
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

  return (
    thumbnail &&
    itemtype === "video" && (
      <div
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
          id="renderfile--video-thumbnail"
          className="renderfile--thumbnail"
          src={thumbnail}
          alt="gifthumb"
          title={`Name: ${name}\nSize: ${shorthandsize}\nType: ${fileextension}\nDimensions: ${width}x${height}\nDuration: ${formatDuration(
            duration
          )}`}
        />
        <svg
          viewBox="0 0 100 100"
          fill="#000000de"
          style={{ zIndex: 1, pointerEvents: "none", position: "absolute" }}
        >
          <rect width="25" height="9" y="86" x="70" style={{ zIndex: 2 }} />
          <text
            y="93"
            x="82"
            fill="white"
            style={{ fontSize: "0.5em", textAnchor: "middle" }}
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

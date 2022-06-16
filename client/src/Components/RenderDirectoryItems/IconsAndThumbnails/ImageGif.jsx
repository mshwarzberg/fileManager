import React, { useRef } from "react";
import Filename from "./Icon/Filename";
import formatDuration from "../../../Helpers/FormatVideoTime";

export default function ImageGif(props) {
  const { item, index } = props;
  const {
    name,
    formattedSize,
    thumbnail,
    itemtype,
    height,
    width,
    path,
    duration,
    permission,
  } = item;
  const nameInput = useRef();

  return (
    thumbnail &&
    (itemtype === "image" || itemtype === "gif") && (
      <div
        className="renderitem--block"
        id="renderitem--image-block"
        style={{
          cursor: !permission ? "not-allowed" : "pointer",
          backgroundColor: !permission ? "#ff7878c5" : "",
          border: !permission ? "1.5px solid red" : "",
          opacity: !permission ? 0.6 : 1,
        }}
      >
        <img
          style={{ cursor: !permission ? "not-allowed" : "pointer" }}
          src={thumbnail}
          alt="imagethumb"
          className="renderitem--thumbnail"
          data-index={index}
          data-permission={permission}
          title={`Name: ${name}\nSize: ${formattedSize}\nDimensions: ${width}x${height}${
            duration ? `\nDuration: ${formatDuration(duration)}` : ""
          }\nPath: ${path}`}
        />
        <Filename name={name} nameRef={nameInput} />
      </div>
    )
  );
}

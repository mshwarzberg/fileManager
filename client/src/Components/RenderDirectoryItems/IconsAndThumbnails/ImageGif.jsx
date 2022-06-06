import React, { useRef } from "react";
import Filename from "./Filename";
import formatDuration from "../../../Helpers/FormatVideoTime";

export default function ImageGif(props) {
  const { item } = props;
  const {
    name,
    shorthandsize,
    fileextension,
    thumbnail,
    itemtype,
    height,
    width,
    path,
    duration,
  } = item;
  const nameInput = useRef();

  return (
    thumbnail &&
    (itemtype === "image" || itemtype === "gif") && (
      <>
        <div className="renderitem--block" id="renderitem--image-block">
          <img
            src={thumbnail}
            width={512}
            height={512}
            alt="imagethumb"
            className="renderitem--thumbnail"
            title={`Name: ${name}\nSize: ${shorthandsize}\nType: ${fileextension}\nDimensions: ${width}x${height}${
              duration ? `\nDuration: ${formatDuration(duration)}` : ""
            }\nPath: ${path}`}
          />
          <Filename name={name} nameRef={nameInput} />
        </div>
      </>
    )
  );
}

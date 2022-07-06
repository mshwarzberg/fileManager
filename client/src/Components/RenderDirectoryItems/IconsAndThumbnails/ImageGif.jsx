import React from "react";
import Filename from "./Icon/Filename";

export default function ImageGif(props) {
  const { name, thumbnail, permission } = props.item;

  return (
    thumbnail && (
      <div
        className="block-container"
        id="renderitem--image-block"
        onMouseDown={(e) => {
          if (e.button === 0) {
            e.stopPropagation();
            return;
          }
        }}
      >
        <img
          style={{ cursor: !permission ? "not-allowed" : "pointer" }}
          src={thumbnail}
          alt="imagethumb"
          className="renderitem--thumbnail"
        />
        <Filename name={name} />
      </div>
    )
  );
}

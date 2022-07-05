import React, { useRef } from "react";
import Filename from "./Icon/Filename";
import useDrag from "../../../Hooks/useDrag";
import IconStyle from "../../../Helpers/IconStyle";

export default function ImageGif(props) {
  const { name, thumbnail, permission } = props.item;

  const blockRef = useRef();
  const { XY, setIsDragging } = useDrag(blockRef.current, false, true);

  return (
    thumbnail && (
      <div
        className="block-container"
        id="renderitem--image-block"
        style={IconStyle(permission, XY)}
        onMouseDown={(e) => {
          if (e.button === 0) {
            setIsDragging(true);
            e.stopPropagation();
            return;
          }
        }}
        ref={blockRef}
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

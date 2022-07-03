import React, { useRef } from "react";
import Filename from "./Icon/Filename";
import useDrag from "../../../Hooks/useDrag";

export default function ImageGif(props) {
  const { item, index, getTitle } = props;
  const { name, thumbnail, path, permission } = item;

  const nameInput = useRef();
  const blockRef = useRef();
  const { XY, setIsDragging } = useDrag(blockRef.current, false, true);

  return (
    thumbnail && (
      <div
        className="renderitem--block"
        id="renderitem--image-block"
        data-srcpath={path}
        data-name={name}
        style={{
          cursor: !permission ? "not-allowed" : "pointer",
          backgroundColor: !permission ? "#ff7878c5" : "",
          border: !permission ? "1.5px solid red" : "",
          opacity: !permission ? 0.6 : "",
          ...((XY.x || XY.y) && {
            top: XY.y,
            left: XY.x,
            zIndex: 100,
            pointerEvents: "none",
            backgroundColor: "black",
            border: "2px solid pink",
            opacity: 0.8,
          }),
        }}
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
          data-index={index}
          data-permission={permission}
          data-title={getTitle()}
        />
        <Filename name={name} nameRef={nameInput} />
      </div>
    )
  );
}

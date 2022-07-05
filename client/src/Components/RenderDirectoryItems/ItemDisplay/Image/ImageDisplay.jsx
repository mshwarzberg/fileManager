import React, { useRef } from "react";
import useDrag from "../../../../Hooks/useDrag";
import DisplayMiscellaneous from "../../../Tools/DisplayMiscellaneous";
import useFullscreenElement from "../../../../Hooks/useFullscreenElement";

function ImageDisplay(props) {
  const { viewItem, setViewItem } = props;

  const image = useRef();

  const { setIsDragging, XY } = useDrag(image.current);

  const { fullscreenControl, fullscreen } = useFullscreenElement();

  return (
    <div
      className="display--block"
      onWheel={(e) => {
        let size = image.current.style.scale;
        if (e.deltaY > 0 && size > 0.5) {
          image.current.style.scale = 1 * size - 0.025;
          image.current.style.transform = `scale(${1 * size + 0.1})`;
        } else if (e.deltaY < 0 && image.current && size < 5) {
          image.current.style.scale = 1 * size + 0.025;
          image.current.style.transform = `scale(${1 * size + 0.1})`;
        }
      }}
      onLoad={() => {
        image.current.style.scale = 1;
      }}
    >
      <DisplayMiscellaneous viewItem={viewItem} setViewItem={setViewItem} />
      <img
        ref={image}
        style={{ left: XY.x, top: XY.y }}
        onLoad={(e) => {
          e.target.id = "image-display";
        }}
        className={
          fullscreen ? "viewitem--item image-fullscreen" : "viewitem--item"
        }
        src={viewItem.property}
        alt={viewItem.name}
        onMouseDown={(e) => {
          if (e.button === 1) {
            image.current.style.scale = 1;
            image.current.style.transform = "";
            image.current.style.left = "";
            image.current.style.top = "";
            image.current.style.cursor = "default";
            e.preventDefault();
            return;
          }
          if (
            image.current.style.scale > 1 ||
            image.current.style.left !== "" ||
            image.current.style.top !== ""
          ) {
            image.current.style.cursor = "grabbing";
            setIsDragging(true);
          }
        }}
        onMouseUp={() => {
          image.current.style.cursor =
            image.current.style.scale > 1 ? "grab" : "default";
        }}
        onDoubleClick={() => {
          fullscreenControl();
        }}
      />
    </div>
  );
}

export default ImageDisplay;

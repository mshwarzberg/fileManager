import React, { useRef, useEffect } from "react";
import useDrag from "../../../../Hooks/useDrag";

function ImageDisplay(props) {
  const { viewItem, fullscreen, enterExitFullscreen } = props;

  const image = useRef();

  const { setIsDragging, onMouseMove } = useDrag(image?.current);
  useEffect(() => {
    let hideCursor;
    if (document.fullscreenElement) {
      document.addEventListener("mousemove", () => {
        if (image.current) {
          image.current.style.cursor = "default";
          hideCursor = setTimeout(() => {
            image.current.style.cursor = "none";
          }, 2000);
        }
      });
    }
    return () => {
      document.removeEventListener("mousemove", () => {});
      clearTimeout(hideCursor);
    };
  });
  return (
    <div
      className="viewitem--block"
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
        image.current.style.transform = "";
        image.current.style.left = "";
        image.current.style.top = "";
        image.current.style.cursor = "default";
        image.current.style.position = "fixed";
      }}
    >
      <img
        ref={image}
        onDoubleClick={() => {
          enterExitFullscreen();
        }}
        id={fullscreen ? "image-fullscreen" : ""}
        className={"viewitem--item"}
        src={viewItem.property}
        alt={viewItem.name}
        onMouseDown={(e) => {
          if (e.button === 1) {
            image.current.style.transform = "";
            image.current.style.scale = 1;
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
        onMouseUp={(e) => {
          setIsDragging(false);
          if (document.fullscreenElement) {
            return;
          }
          image.current.style.cursor =
            image.current.style.scale > 1 ? "grab" : "default";
          document.removeEventListener("mousemove", onMouseMove);
        }}
      />
    </div>
  );
}

export default ImageDisplay;

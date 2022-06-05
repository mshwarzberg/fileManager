import React, { useRef, useState, useEffect } from "react";

function ImageDisplay(props) {
  const { viewItem, fullscreen, enterExitFullscreen } = props;
  const [isDragging, setIsDragging] = useState(false);

  function moveAt(movementX, movementY) {
    if (image.current) {
      let positionX = image.current.style.left;
      positionX = positionX.split("px")[0];
      positionX = movementX * 1 + positionX * 1;

      let positionY = image.current.style.top;
      positionY = positionY.split("px")[0];
      positionY = movementY * 1 + positionY * 1;

      image.current.style.left = positionX + "px";
      image.current.style.top = positionY + "px";
    }
  }
  
  function onMouseMove(e) {
    moveAt(e.movementX, e.movementY);
  }

  useEffect(() => {
    if (
      isDragging &&
      (image.current.style.scale > 1 ||
        image.current.style.left !== "" ||
        image.current.style.top !== "")
    ) {
      window.addEventListener("blur", () => {
        if (image.current) {
          setIsDragging(false);
          image.current.style.cursor = "default";
          document.removeEventListener("mousemove", onMouseMove);
        }
      });
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("dragstart", (e) => {
        e.preventDefault();
        return false;
      });
    }

    return () => {
      window.removeEventListener("blur", () => {});
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("dragstart", () => {});
    };
  });

  const image = useRef();

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
          if (e.button === 1) {
            return;
          }
          setIsDragging(false);
          if (document.fullscreenElement) {
            return;
          }
          image.current.style.cursor =
            image.current.style.scale > 1 ? "grab" : "default";
          document.removeEventListener("mousemove", onMouseMove);
        }}
        onDragStart={(e) => {
          e.preventDefault();
          return false;
        }}
      />
    </div>
  );
}

export default ImageDisplay;

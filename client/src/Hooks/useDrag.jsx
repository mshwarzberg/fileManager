import { useState, useEffect, useCallback } from "react";

export default function useDrag(
  element,
  snapToMousePosition,
  resetOnUp,
  scaling,
  axisLocked
) {
  const [isDragging, setIsDragging] = useState(false);
  const [XY, setXY] = useState({
    x: null,
    y: null,
  });

  const onMouseMove = useCallback(
    (e) => {
      moveAt(e.movementX, e.movementY);
      function moveAt(movementX, movementY) {
        if (element) {
          let positionX = !scaling ? element.style.left : element.style.width;
          positionX = positionX.split("px")[0];
          positionX = movementX * 1 + positionX * 1;

          let positionY = !scaling ? element.style.top : element.style.height;
          positionY = positionY.split("px")[0];
          positionY = movementY * 1 + positionY * 1;

          if ((positionX <= 0 || positionY <= 0) && snapToMousePosition) {
            positionX = e.clientX;
            positionY = e.clientY;
          }

          setXY({
            x: (axisLocked === "X" || !axisLocked) && positionX + "px",
            y: (axisLocked === "Y" || !axisLocked) && positionY + "px",
          });
        }
      }
    },
    // eslint-disable-next-line
    [element]
  );

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mouseup", (e) => {
        setIsDragging(false);
        if (resetOnUp && isDragging) {
          setXY({
            x: "",
            y: "",
          });
        }
      });
      window.addEventListener("blur", () => {
        if (element) {
          setIsDragging(false);
          element.style.cursor = "default";
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
      document.removeEventListener("mouseup", () => {});
    };
    // eslint-disable-next-line
  }, [isDragging, setIsDragging, element]);

  return { setIsDragging, isDragging, XY, onMouseMove };
}

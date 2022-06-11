import { useState, useEffect, useCallback } from "react";

export default function useDrag(item) {
  const [isDragging, setIsDragging] = useState(false);

  const onMouseMove = useCallback(
    (e) => {
      moveAt(e.movementX, e.movementY);
      function moveAt(movementX, movementY) {
        if (item) {
          let positionX = item.style.left;
          positionX = positionX.split("px")[0];
          positionX = movementX * 1 + positionX * 1;

          let positionY = item.style.top;
          positionY = positionY.split("px")[0];
          positionY = movementY * 1 + positionY * 1;

          item.style.left = positionX + "px";
          item.style.top = positionY + "px";
        }
      }
    },
    [item]
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("blur", () => {
        if (item) {
          setIsDragging(false);
          item.style.cursor = "default";
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
  }, [isDragging, setIsDragging, item, onMouseMove]);

  return { setIsDragging, onMouseMove, isDragging };
}

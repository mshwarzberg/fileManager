import { useState, useEffect, useCallback } from "react";

export default function useDrag() {
  const [dragRules, setDragRules] = useState({});
  const [element, setElement] = useState();
  const [isDragging, setIsDragging] = useState();

  const { axisLockedTo, scaling, resetOnUp } = dragRules;

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

          element.style.top =
            (axisLockedTo === "Y" || !axisLockedTo) && positionY + "px";
          element.style.left =
            (axisLockedTo === "X" || !axisLockedTo) && positionX + "px";
        }
      }
    },
    // eslint-disable-next-line
    [element]
  );
  function reset(timeout) {
    clearTimeout(timeout);
    setIsDragging(false);
    if (resetOnUp && element) {
      element.style.pointerEvents = "";
      element.style.top = "";
      element.style.left = "";
      element.style.zIndex = "";
      element.style.backgroundColor = "";
      element.style.border = "";
      document.body.style.cursor = "";
    }
  }

  useEffect(() => {
    let dragTimeout;

    document.addEventListener("mouseup", () => {
      reset(dragTimeout);
    });
    window.addEventListener("blur", () => {
      reset(dragTimeout);
    });
    document.addEventListener("mousedown", (e) => {
      if (e.button === 0 && e.target.dataset.drag) {
        dragTimeout = setTimeout(() => {
          const dataset = JSON.parse(e.target.dataset.drag);
          const tempEl =
            dataset.element === "parentElement"
              ? e.target.parentElement
              : e.target;
          tempEl.style.pointerEvents = "none";
          tempEl.style.zIndex = 10;
          tempEl.style.backgroundColor = "black";
          tempEl.style.border = "2px solid pink";
          document.body.style.cursor = "grabbing";
          setIsDragging(true);
          setElement(tempEl);
          setDragRules(dataset);
        }, 100);
      }
    });
    if (isDragging) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("dragstart", (e) => {
        e.preventDefault();
      });
    }
    return () => {
      window.removeEventListener("blur", () => {});
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("dragstart", () => {});
      document.removeEventListener("mouseup", () => {});
    };
    // eslint-disable-next-line
  }, [isDragging, setIsDragging, element, setElement]);
}

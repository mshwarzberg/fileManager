import { useState, useEffect, useCallback } from "react";
import TransferFunction from "../Components/Tools/ContextMenu/Functions/TransferFunction";

let dragTimeout;
export default function useDrag() {
  const [dragRules, setDragRules] = useState({});
  const [element, setElement] = useState();

  const { axisLockedTo, scaling, resetOnUp, andDrop } = dragRules;

  function moveAt(e) {
    const movementX = e.movementX;
    const movementY = e.movementY;

    if (element) {
      let positionX = !scaling ? element.style.left : element.style.width;
      positionX = positionX.split("px")[0];
      positionX = movementX * 1 + positionX * 1;

      let positionY = !scaling ? element.style.top : element.style.height;
      positionY = positionY.split("px")[0];
      positionY = movementY * 1 + positionY * 1;

      if (scaling) {
        element.style.height =
          (axisLockedTo === "Y" || !axisLockedTo) && e.clientY + "px";
        element.style.width =
          (axisLockedTo === "X" || !axisLockedTo) && e.clientX + "px";
        return;
      }

      element.style.top =
        (axisLockedTo === "Y" || !axisLockedTo) && positionY + "px";
      element.style.left =
        (axisLockedTo === "X" || !axisLockedTo) && positionX + "px";
    }
  }

  function reset(timeout) {
    clearTimeout(timeout);
    if (element) {
      document.body.style.cursor = "";
      if (resetOnUp) {
        element.style.top = "";
        element.style.left = "";
        element.style.width = "";
        element.style.height = "";
      }
      setElement(null);
    }
  }
  function handleMouseDown(e) {
    if (e.button === 0 && e.target.dataset.drag) {
      const dataset = JSON.parse(e.target.dataset.drag);
      dragTimeout = setTimeout(() => {
        const tempEl = dataset.element ? e.target[dataset.element] : e.target;

        document.body.style.cursor = "grabbing";
        setElement(tempEl);
        setDragRules(dataset);
      }, dataset.responseTime || 150);
    }
  }
  useEffect(() => {
    let dragTimeout;
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", (e) => {
      reset(dragTimeout);
    });
    if (element) {
      window.addEventListener("blur", () => {
        reset(dragTimeout);
      });
      document.addEventListener("mousemove", moveAt);
      document.addEventListener("dragstart", (e) => {
        e.preventDefault();
      });
    }
    return () => {
      window.removeEventListener("blur", () => {});
      document.removeEventListener("mousemove", moveAt);
      document.removeEventListener("dragstart", () => {});
      document.removeEventListener("mouseup", () => {});
    };
    // eslint-disable-next-line
  }, [element]);
}

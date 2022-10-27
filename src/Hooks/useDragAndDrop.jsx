import { useEffect, useState } from "react";
import { handleTransfer } from "../Helpers/FS and OS/HandleTransfer";

export default function useDragAndDrop(
  [selectedItems, setSelectedItems],
  [drag, setDrag],
  currentDirectory,
  setPopup
) {
  useEffect(() => {
    function handleMouseMove(e) {
      if (drag.x && drag.y) {
        const dragElement = document.getElementById("drag-box");
        dragElement.style.left = e.clientX - 64 + "px";
        dragElement.style.top = e.clientY - 64 + "px";
        const { destination } = e.target.dataset;
        if (destination && currentDirectory !== destination) {
          const drive = currentDirectory.slice(0, 3);
          if (destination.startsWith(drive)) {
            setDrag((prevDrag) => ({
              ...prevDrag,
              mode: "move",
              destination: destination,
            }));
          } else {
            setDrag((prevDrag) => ({
              ...prevDrag,
              mode: "copy",
              destination: destination,
            }));
          }
        } else {
          setDrag((prevDrag) => ({
            ...prevDrag,
            mode: null,
          }));
        }
      }
    }
    function handleMouseUp(e) {
      if (drag.x && drag.y) {
        const { destination } = e.target.dataset;
        if (destination) {
          handleTransfer(
            destination,
            setPopup,
            {
              source: currentDirectory,
              mode: drag.mode,
              info: selectedItems.map((selectedItem) => selectedItem.info),
            },
            () => {}
          );
          if (currentDirectory !== destination && drag.mode === "move") {
            setSelectedItems([]);
          }
        }
        setDrag({});
      }
    }
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [drag, selectedItems]);
}

import { useEffect } from "react";
import { handleTransfer } from "../Helpers/FS and OS/HandleTransfer";

export default function useDragAndDrop(
  [selectedItems, setSelectedItems],
  [drag, setDrag],
  currentDirectory,
  setPopup
) {
  useEffect(() => {
    function clearDrag() {
      setDrag();
    }
    function handleDrag(e) {
      if (drag) {
        const dragElement = document.getElementById("drag-box");
        dragElement.style.left = e.clientX - 64 + "px";
        dragElement.style.top = e.clientY - 64 + "px";
      }
    }
    function handleMouseUp(e) {
      if (drag) {
        const { destination } = e.target.dataset;
        if (destination !== currentDirectory && destination) {
          handleTransfer(
            destination,
            setPopup,
            {
              source: currentDirectory,
              mode: "cut",
              info: selectedItems.map((selectedItem) => selectedItem.info),
            },
            () => {},
            true
          );
        }
        setSelectedItems([]);
        setDrag();
      }
    }
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", clearDrag);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", clearDrag);
    };
  }, [drag, selectedItems]);
}

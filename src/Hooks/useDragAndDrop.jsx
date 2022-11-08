import { useEffect, useState } from "react";
import clickOnItem from "../Helpers/ClickOnItem";
import { handleTransfer } from "../Helpers/FS and OS/HandleTransfer";

let enterFolderTimeout;
export default function useDragAndDrop(
  [selectedItems, setSelectedItems = () => {}],
  [drag, setDrag = () => {}],
  currentDirectory,
  setPopup = () => {},
  dispatch = () => {}
) {
  const [sourceDirectory, setSourceDirectory] = useState();

  useEffect(() => {
    setSourceDirectory(currentDirectory);
  }, [drag.x, drag.y]);

  useEffect(() => {
    function handleMouseMove(e) {
      clearTimeout(enterFolderTimeout);
      if (drag.x && drag.y) {
        const dragElement = document.getElementById("drag-box");
        dragElement.style.left = e.clientX - 64 + "px";
        dragElement.style.top = e.clientY - 64 + "px";
        const { destination } = e.target.dataset;
        if (destination && sourceDirectory !== destination) {
          const drive = sourceDirectory.slice(0, 3);
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
          enterFolderTimeout = setTimeout(() => {
            clickOnItem(JSON.parse(e.target.dataset.info || "{}"), dispatch);
          }, 1000);
        } else {
          setDrag((prevDrag) => ({
            ...prevDrag,
            mode: null,
          }));
        }

        if (e.buttons !== 1 && e.buttons !== 2) {
          setDrag({});
        }
      }
    }
    function handleMouseUp(e) {
      if (drag.x && drag.y) {
        const { destination } = e.target.dataset;
        if (destination && drag.mode) {
          handleTransfer(
            destination,
            setPopup,
            {
              source: sourceDirectory,
              mode: drag.mode,
              info: selectedItems.map((path) => {
                const element = document.getElementById(path);
                const info = JSON.parse(element.dataset.info || "{}");
                return info;
              }),
            },
            () => {}
          );
          if (sourceDirectory !== destination && drag.mode === "move") {
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

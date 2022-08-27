import { useEffect, useContext, useState } from "react";
import { GeneralContext } from "../Components/Main/App";
import PasteFunction from "../Components/Tools/ContextMenu/Functions/Paste/PasteFunction";
import { foundInArrayWithKey } from "../Helpers/SearchArray";

let startDragTimeout, enterFolderTimeout;
export default function useDragItems(setPopup, dragAndDrop, setDragAndDrop) {
  const {
    itemsSelected,
    state,
    setDirectoryItems,
    setItemsSelected,
    dispatch,
  } = useContext(GeneralContext);

  useEffect(() => {
    function handleMouseDown(e) {
      if (e.button === 0 && e.target.className === "cover-block") {
        startDragTimeout = setTimeout(() => {
          if (e.ctrlKey) {
            setItemsSelected((prevItems) => [
              ...prevItems,
              {
                info: JSON.parse(e.target.dataset.info || "{}"),
                element: e.target.parentElement,
              },
            ]);
          } else if (
            !foundInArrayWithKey(
              itemsSelected,
              e.target.parentElement,
              "element"
            )
          ) {
            setItemsSelected([
              {
                info: JSON.parse(e.target.dataset.info || "{}"),
                element: e.target.parentElement,
              },
            ]);
          }
          setDragAndDrop(document.getElementById("drag-and-drop-box"));
        }, 300);
      }
    }
    function handleMouseMove(e) {
      if (dragAndDrop) {
        clearTimeout(enterFolderTimeout);
        if (
          e.target.dataset.destination &&
          e.target.id !== "renderitem--page"
        ) {
          enterFolderTimeout = setTimeout(() => {
            dispatch({
              type: "openDirectory",
              value: JSON.parse(e.target.dataset.destination || "{}")
                .destination,
            });
          }, 500);
        }
        const dragAndDropSize = dragAndDrop.getBoundingClientRect();
        dragAndDrop.style.display = "flex";
        dragAndDrop.style.top = e.clientY - dragAndDropSize.height / 2 + "px";
        dragAndDrop.style.left = e.clientX - dragAndDropSize.width / 2 + "px";
      }
    }
    function handleMouseUp(e) {
      clearTimeout(enterFolderTimeout);
      clearTimeout(startDragTimeout);
      if (e.button === 0 && dragAndDrop) {
        if (
          e.target.dataset.destination ||
          e.target.className === "cover-block"
        ) {
          let destination =
            JSON.parse(e.target.dataset.destination || "{}").destination ||
            state.currentDirectory;

          if (itemsSelected[0]?.info.path !== destination) {
            PasteFunction(
              itemsSelected,
              destination,
              "cut",
              state.currentDirectory,
              {
                setDirectoryItems: setDirectoryItems,
                setPopup: setPopup,
                setContextMenu: () => {},
                setClipboardData: () => {},
              }
            );
          }
        }

        dragAndDrop.style.display = "none";
        setDragAndDrop();
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    // eslint-disable-next-line
  }, [dragAndDrop, itemsSelected, state.currentDirectory]);
}

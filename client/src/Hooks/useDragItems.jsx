import { useEffect, useContext, useState } from "react";
import { GeneralContext } from "../Components/Main/App";
import PasteFunction from "../Components/Tools/ContextMenu/Functions/Paste/PasteFunction";

let timeout;
export default function useDragItems(
  setDragCount,
  dragCount,
  setAlert,
  setConfirm
) {
  const [dragMe, setDragMe] = useState([]);
  const {
    itemsSelected,
    state,
    setDirectoryItems,
    setItemsSelected,
    directoryItems,
  } = useContext(GeneralContext);

  useEffect(() => {
    function handleMouseDown(e) {
      if (e.button === 0 && e.target.className === "cover-block") {
        timeout = setTimeout(() => {
          let dragTheseItems = [
            ...itemsSelected.map((itemSelected) => {
              return itemSelected.element;
            }),
          ];
          if (e.ctrlKey) {
            setItemsSelected((prevItems) => [
              ...prevItems,
              {
                info: JSON.parse(e.target.dataset.info || "{}"),
                element: e.target.parentElement,
              },
            ]);
            dragTheseItems.push(e.target.parentElement);
          } else if (!dragTheseItems.includes(e.target.parentElement)) {
            setItemsSelected([
              {
                info: JSON.parse(e.target.dataset.info || "{}"),
                element: e.target.parentElement,
              },
            ]);
            dragTheseItems = [
              {
                info: JSON.parse(e.target.dataset.info || "{}"),
                element: e.target.parentElement,
              },
            ];
          }

          setDragCount(dragTheseItems.length);
          setDragMe(dragTheseItems);
        }, 300);
      }
    }
    function handleMouseMove(e) {
      if (dragMe[0]) {
        for (const item of dragMe) {
          const blockSize = item.getBoundingClientRect();
          const dragCountElement = document.getElementById("drag-count");
          dragCountElement.style.left =
            e.clientX -
            dragCountElement.getBoundingClientRect().width / 2 +
            "px";
          dragCountElement.style.top =
            e.clientY -
            blockSize.height / 2 -
            dragCountElement.getBoundingClientRect().height -
            5 +
            "px";
          item.style.position = "fixed";
          item.style.left = e.clientX - blockSize.width / 2 + "px";
          item.style.top = e.clientY - blockSize.height / 2 + "px";
          item.style.pointerEvents = "none";
          item.style.zIndex = 50;
          let opacity;
          if (dragMe.length > 10) {
            opacity = 0.3;
          } else if (dragMe.length > 6) {
            opacity = 0.4;
          } else if (dragMe.length > 3) {
            opacity = 0.65;
          } else {
            opacity = 0.75;
          }
          item.style.opacity = opacity;
        }
      }
    }

    function handleMouseUp(e) {
      clearTimeout(timeout);
      if (e.button === 0 && dragMe[0]) {
        if (e.target.dataset.destination) {
          const { path } = JSON.parse(e.target.dataset.destination || "{}");

          if (path && path !== state.currentDirectory) {
            PasteFunction(
              itemsSelected,
              path,
              "cut",
              state.currentDirectory,
              directoryItems,
              {
                setDirectoryItems: setDirectoryItems,
                setConfirm: setConfirm,
                setAlert: setAlert,
                setContextMenu: () => {},
                setClipboardData: () => {},
              }
            );
          }
        }
        for (const item of dragMe) {
          item.style.zIndex = "";
          item.style.position = "";
          item.style.pointerEvents = "";
          item.style.left = "";
          item.style.top = "";
          item.style.opacity = 1;
        }
      }
      setDragCount();
      setDragMe([]);
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
  }, [dragMe, itemsSelected, dragCount]);
}

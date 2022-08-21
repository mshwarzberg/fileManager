import { useEffect, useContext, useState } from "react";
import TransferFunction from "../Helpers/TransferFunction";
import { GeneralContext } from "../Components/Main/App";

let timeout;
export default function useDragItems() {
  const [dragMe, setDragMe] = useState([]);
  const { itemsSelected, state, setDirectoryItems } =
    useContext(GeneralContext);

  useEffect(() => {
    function handleMouseDown(e) {
      if (
        e.target.dataset.info &&
        e.button === 0 &&
        e.target.className === "cover-block"
      ) {
        timeout = setTimeout(() => {
          if (!itemsSelected[0]) {
            return setDragMe([e.target.parentElement]);
          }
          const dragTheseItems = [
            ...itemsSelected.map((itemSelected) => {
              return itemSelected.element;
            }),
          ];

          const dragMeCount = document.createElement("div");
          dragMeCount.innerHTML = dragTheseItems.length;
          dragMeCount.id = "drag-count";

          dragTheseItems[dragTheseItems.length - 1].appendChild(dragMeCount);
          setDragMe(dragTheseItems);
        }, 300);
      }
    }
    function handleMouseMove(e) {
      if (dragMe[0]) {
        for (const item of dragMe) {
          const blockSize = item.getBoundingClientRect();
          item.style.position = "fixed";
          item.style.left = e.clientX - blockSize.width / 2 + "px";
          item.style.top = e.clientY - blockSize.height / 2 + "px";
          item.style.pointerEvents = "none";
          item.style.zIndex = 100;
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
        if (e.target.dataset.info) {
          const destinationInfo = JSON.parse(e.target.dataset.info);
          const { path } = JSON.parse(e.target.dataset.destination || "{}");
          if (
            (destinationInfo.isDirectory || destinationInfo.isDrive) &&
            path &&
            path !== state.currentDirectory
          ) {
            TransferFunction(
              itemsSelected,
              path,
              "cut",
              state.currentDirectory,
              setDirectoryItems
            );
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
      }
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
  }, [dragMe, setDragMe, itemsSelected]);
}

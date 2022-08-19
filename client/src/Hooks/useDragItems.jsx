import { useEffect, useContext, useState } from "react";
import TransferFunction from "../Helpers/TransferFunction";
import { GeneralContext } from "../Components/Main/App";

let timeout;
export default function useDragItems() {
  const [dragMe, setDragMe] = useState();
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
          setDragMe(e.target.parentElement);
          document.body.style.cursor = "grabbing";
        }, 300);
      }
    }
    function handleMouseMove(e) {
      if (dragMe) {
        const blockSize = dragMe.getBoundingClientRect();
        dragMe.style.position = "fixed";
        dragMe.style.left = e.clientX - blockSize.width / 2 + "px";
        dragMe.style.top = e.clientY - blockSize.height / 2 + "px";
        dragMe.style.pointerEvents = "none";
        dragMe.style.backgroundColor = "#222";
        dragMe.style.zIndex = 100;
        dragMe.style.opacity = 0.8;
      }
    }
    function handleMouseUp(e) {
      clearTimeout(timeout);
      if (e.button === 0 && dragMe) {
        if (e.target.dataset?.info && dragMe.lastChild?.dataset?.info) {
          const destination = JSON.parse(e.target.dataset.info);
          const source = JSON.parse(dragMe.lastChild.dataset.info);
          if (
            (destination.isDirectory || destination.isDrive) &&
            destination.path &&
            destination.path !== state.currentDirectory
          ) {
            const metadata = itemsSelected[0] ? itemsSelected : [source];
            TransferFunction(
              metadata,
              destination.path,
              "cut",
              state.currentDirectory,
              setDirectoryItems
            );
          }
          dragMe.style.backgroundColor = "";
          dragMe.style.zIndex = "";
          dragMe.style.position = "";
          dragMe.style.pointerEvents = "";
          dragMe.style.left = "";
          dragMe.style.top = "";
          dragMe.style.opacity = 1;
          document.body.style.cursor = "";
        }
      }

      setDragMe(false);
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
  }, [dragMe, setDragMe]);
}

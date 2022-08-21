import { useEffect, useContext } from "react";
import { GeneralContext } from "../Components/Main/App";

let scrollWhileDraggingDown, scrollWhileDraggingUp;
export default function useSelectMultiple() {
  const { setItemsSelected } = useContext(GeneralContext);
  function highlightItems(boxDimensions, e) {
    const elements = document.getElementsByClassName("cover-block");
    let infoArray = [];
    for (const element of elements) {
      const elDimensions = element.getBoundingClientRect();

      if (
        elDimensions.x + elDimensions.width > boxDimensions.x &&
        elDimensions.x < boxDimensions.right &&
        elDimensions.y + elDimensions.height > boxDimensions.y &&
        elDimensions.y < boxDimensions.bottom
      ) {
        const info = JSON.parse(element.dataset.info);
        if (info.permission && info.name) {
          infoArray.push({
            info: info,
            element: element.parentElement,
          });
        }
      }
    }

    if (e.ctrlKey) {
      setItemsSelected((prevArray) => [...prevArray, ...infoArray]);
      return;
    }

    setItemsSelected(infoArray);
  }
  useEffect(() => {
    let isBox, anchorY, anchorX;
    const box = document.getElementById("highlight--box");

    function handleMouseDown(e) {
      if (e.target.className === "cover-block" || e.button !== 0) {
        return;
      }
      if (!e.ctrlKey) {
        setItemsSelected([]);
      }
      isBox = true;
      const page = document.getElementById("renderitem--page");
      const pageDimensions = page.getBoundingClientRect();
      box.style.top = e.clientY - pageDimensions.top + page.scrollTop + "px";
      box.style.left = e.clientX - pageDimensions.left + page.scrollLeft + "px";
      box.style.display = "block";
      anchorX = e.clientX - pageDimensions.left + page.scrollLeft;
      anchorY = e.clientY - pageDimensions.top + page.scrollTop;
    }

    function handleMouseMove(e) {
      if (isBox) {
        const page = document.getElementById("renderitem--page");
        const pageDimensions = page.getBoundingClientRect();

        const currentPositionY =
          e.clientY - pageDimensions.top + page.scrollTop;
        const currentPositionX =
          e.clientX - pageDimensions.left + page.scrollLeft;

        if (anchorY < currentPositionY) {
          box.style.height = currentPositionY - anchorY + "px";
          box.style.top = anchorY + "px";
        } else if (anchorY > currentPositionY) {
          box.style.height = Math.abs(currentPositionY - anchorY) + "px";
          box.style.top = anchorY - Math.abs(currentPositionY - anchorY) + "px";
        }
        if (anchorX < currentPositionX) {
          box.style.width = currentPositionX - anchorX + "px";
          box.style.left = anchorX + "px";
        } else if (anchorX > currentPositionX) {
          box.style.width = Math.abs(currentPositionX - anchorX) + "px";
          box.style.left =
            anchorX - Math.abs(currentPositionX - anchorX) + "px";
        }

        clearInterval(scrollWhileDraggingDown);
        clearInterval(scrollWhileDraggingUp);
        if (e.clientY < 100) {
          scrollWhileDraggingUp = setInterval(() => {
            page.scroll(0, page.scrollTop - 10);
          }, 10);
        } else if (e.clientY > pageDimensions.bottom - 20) {
          scrollWhileDraggingDown = setInterval(() => {
            page.scroll(0, page.scrollTop + 10);
          }, 10);
        }
        highlightItems(box.getBoundingClientRect(), e);
      }
    }
    function handleMouseUp() {
      isBox = null;
      box.style.display = "none";
      box.style.width = "";
      box.style.left = "";
      box.style.height = "";
      box.style.top = "";
    }
    document
      .getElementById("renderitem--page")
      .addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
      document
        .getElementById("renderitem--page")
        ?.removeEventListener("mousedown", handleMouseDown);
    };
    // eslint-disable-next-line
  }, []);
}

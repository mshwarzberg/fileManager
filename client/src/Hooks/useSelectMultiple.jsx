import { useEffect, useContext } from "react";
import { GeneralContext } from "../Components/Main/App";

export default function useSelectMultiple() {
  const { setItemsSelected } = useContext(GeneralContext);
  function highlightItems(boxDimensions, ctrlKey) {
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
          infoArray.push(info);
        }
      }
    }

    if (ctrlKey) {
      setItemsSelected((prevArray) => [...prevArray, ...infoArray]);
      return;
    }

    setItemsSelected(infoArray);
  }
  useEffect(() => {
    let isBox, anchorY, anchorX;
    const box = document.getElementById("highlight--box");
    function handleMouseDown(e) {
      if (e.target.className === "cover-block") {
        return;
      }
      if (!e.ctrlKey) {
        setItemsSelected([]);
      }

      isBox = true;
      box.style.top = e.clientY + "px";
      box.style.left = e.clientX + "px";
      box.style.display = "block";
      anchorX = e.clientX;
      anchorY = e.clientY;
    }
    function handleMouseMove(e) {
      if (isBox) {
        const boxDimensions = box.getBoundingClientRect();
        if (e.clientX < anchorX) {
          if (e.movementX < 0) {
            box.style.width =
              Math.abs(e.movementX) + boxDimensions.width + "px";
            box.style.left = boxDimensions.x - Math.abs(e.movementX) + "px";
          } else {
            box.style.width = -e.movementX + boxDimensions.width + "px";
            box.style.left = boxDimensions.x + e.movementX + "px";
          }
        } else {
          box.style.width = boxDimensions.width + e.movementX + "px";
        }
        if (e.clientY < anchorY) {
          if (e.movementY < 0) {
            box.style.height =
              Math.abs(e.movementY) + boxDimensions.height + "px";
            box.style.top = boxDimensions.y - Math.abs(e.movementY) + "px";
          } else {
            box.style.height = -e.movementY + boxDimensions.height + "px";
            box.style.top = boxDimensions.y + e.movementY + "px";
          }
        } else {
          box.style.height = boxDimensions.height + e.movementY + "px";
        }
        highlightItems(box.getBoundingClientRect(), e.ctrlKey);
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

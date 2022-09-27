import { useEffect, useContext } from "react";
import { DirectoryContext } from "../Components/Main/App";

export default function useSelectMultiple(setLastSelected) {
  const { setItemsSelected } = useContext(DirectoryContext);

  function highlightItems(boxDimensions) {
    const elements = document.getElementsByClassName("display-page-block");
    let infoArray = [];
    for (const element of elements) {
      const elDimensions = element.getBoundingClientRect();
      if (
        elDimensions.x + elDimensions.width > boxDimensions.x &&
        elDimensions.x < boxDimensions.right &&
        elDimensions.y + elDimensions.height > boxDimensions.y &&
        elDimensions.y < boxDimensions.bottom
      ) {
        const info = JSON.parse(element.dataset.info || "{}");
        if (info.permission && info.name) {
          infoArray.push({
            info: info,
            element: element,
          });
        }
      }
    }
    setLastSelected(infoArray[0]?.element);
    setItemsSelected(infoArray);
  }
  function changeBoxDimensions(
    box,
    anchorY,
    anchorX,
    currentPositionY,
    currentPositionX
  ) {
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
      box.style.left = anchorX - Math.abs(currentPositionX - anchorX) + "px";
    }
  }
  useEffect(() => {
    let isBox, anchorY, anchorX, scrollOnDrag;
    const box = document.getElementById("select-multiple-box");
    const page = document.getElementById("display-page");

    function handleMouseDown(e) {
      if (e.target.id !== "display-page" || e.button !== 0) {
        return;
      }
      if (!e.shiftKey && !e.ctrlKey) {
        setItemsSelected([]);
      }
      isBox = true;
      const pageDimensions = page.getBoundingClientRect();
      box.style.top = e.clientY - pageDimensions.top + page.scrollTop + "px";
      box.style.left = e.clientX - pageDimensions.left + page.scrollLeft + "px";
      box.style.display = "block";
      anchorX = e.clientX - pageDimensions.left + page.scrollLeft;
      anchorY = e.clientY - pageDimensions.top + page.scrollTop;
    }

    function handleMouseMove(e) {
      if (isBox) {
        const pageDimensions = page.getBoundingClientRect();

        const currentPositionY = Math.min(
          e.clientY - pageDimensions.top + page.scrollTop,
          page.scrollHeight
        );
        const currentPositionX = e.clientX - pageDimensions.left;

        changeBoxDimensions(
          box,
          anchorY,
          anchorX,
          currentPositionY,
          currentPositionX
        );
        highlightItems(box.getBoundingClientRect());
        clearInterval(scrollOnDrag);
        if (e.clientY < 100 && page.scrollTop !== 0) {
          scrollOnDrag = setInterval(() => {
            page.scroll(0, page.scrollTop - 50);
            changeBoxDimensions(box, anchorY, anchorX, 0, currentPositionX);
            highlightItems(box.getBoundingClientRect());
          }, 10);
        } else if (
          e.clientY > page.getBoundingClientRect().height &&
          Math.round(page.scrollTop + page.getBoundingClientRect().height) !==
            page.scrollHeight
        ) {
          scrollOnDrag = setInterval(() => {
            page.scroll(0, page.scrollTop + 50);
            changeBoxDimensions(
              box,
              anchorY,
              anchorX,
              Math.min(page.scrollTop + currentPositionY, page.scrollHeight),
              currentPositionX
            );
            highlightItems(box.getBoundingClientRect());
          }, 10);
        }
      } else {
        clearInterval(scrollOnDrag);
        scrollOnDrag = null;
      }
    }
    function handleMouseUp() {
      clearInterval(scrollOnDrag);
      scrollOnDrag = null;
      isBox = null;
      box.style.display = "none";
      box.style.width = "";
      box.style.height = "";
      box.style.top = "";
      box.style.left = "";
    }
    page.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
      page.removeEventListener("mousedown", handleMouseDown);
    };
    // eslint-disable-next-line
  }, []);
}

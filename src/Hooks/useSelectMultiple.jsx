import { useEffect } from "react";
import { findInArray } from "../Helpers/SearchArray";

let timeout;
export default function useSelectMultiple(setLastSelected, setSelectedItems) {
  function highlightItems(boxDimensions, e) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const elements = document.getElementsByClassName("display-page-block");
      let infoArray = [];
      for (const element of elements) {
        const elDimensions = element.getBoundingClientRect();

        const notToRightOfBlock = elDimensions.x < boxDimensions.right;
        const notToLeftOfBlock =
          elDimensions.x + elDimensions.width > boxDimensions.x;

        const notBelowBlock = elDimensions.y < boxDimensions.bottom;
        const notAboveBlock =
          elDimensions.y + elDimensions.height > boxDimensions.y;

        const isWithinXAxis = notToLeftOfBlock && notToRightOfBlock;
        const isWithinYAxis = notAboveBlock && notBelowBlock;

        if (isWithinXAxis && isWithinYAxis) {
          const info = JSON.parse(element.dataset.info || "{}");
          if (info.name) {
            infoArray.push({
              info: info,
              element: element,
            });
          }
        }
        if (!notBelowBlock) {
          break;
        }
      }
      setLastSelected(infoArray[0]?.element);
      setSelectedItems((prevItems) => {
        let array = [...prevItems];
        if (e.shiftKey || e.ctrlKey) {
          for (const { info, element } of infoArray) {
            if (!prevItems.map((item) => item.element).includes(element)) {
              array.push({
                info: info,
                element: element,
              });
            }
          }
        } else {
          array = infoArray;
        }
        return array;
      });
    }, 0);
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
      if (!e.shiftKey && !e.ctrlKey && e.clientX < window.innerWidth - 12) {
        setSelectedItems([]);
        setLastSelected();
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
        highlightItems(box.getBoundingClientRect(), e);
        clearInterval(scrollOnDrag);
        if (e.clientY < 100 && page.scrollTop !== 0) {
          scrollOnDrag = setInterval(() => {
            page.scroll(0, page.scrollTop - 100);
            changeBoxDimensions(
              box,
              anchorY,
              anchorX,
              page.scrollTop,
              currentPositionX
            );
            highlightItems(box.getBoundingClientRect(), e);
          }, 10);
        } else if (
          e.clientY > page.getBoundingClientRect().height &&
          Math.round(page.scrollTop + page.getBoundingClientRect().height) !==
            page.scrollHeight
        ) {
          scrollOnDrag = setInterval(() => {
            page.scroll(0, page.scrollTop + 100);
            changeBoxDimensions(
              box,
              anchorY,
              anchorX,
              Math.min(page.scrollTop + currentPositionY, page.scrollHeight),
              currentPositionX
            );
            highlightItems(box.getBoundingClientRect(), e);
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
      clearTimeout(timeout);
    };
    // eslint-disable-next-line
  }, []);
}

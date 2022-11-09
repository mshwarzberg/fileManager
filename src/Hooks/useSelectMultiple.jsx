import { useEffect, useState } from "react";

export default function useSelectMultiple(
  setLastSelected = () => {},
  setSelectedItems = () => {},
  pageView
) {
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
        const currentPositionX = Math.min(
          e.clientX - pageDimensions.left + page.scrollLeft,
          page.scrollWidth
        );

        changeBoxDimensions(
          box,
          anchorY,
          anchorX,
          currentPositionY,
          currentPositionX
        );
        // myOther(box);
        clearInterval(scrollOnDrag);
        if (
          (e.clientY < 100 && page.scrollTop !== 0) ||
          (e.clientX < 100 && page.scrollLeft !== 0 && pageView === "list")
        ) {
          scrollOnDrag = setInterval(() => {
            if (pageView !== "list") {
              page.scroll(0, page.scrollTop - 100);
            } else {
              page.scroll(page.scrollLeft - 100, 0);
            }
            changeBoxDimensions(
              box,
              anchorY,
              anchorX,
              page.scrollTop,
              currentPositionX
            );
            // myOther(box);
          }, 10);
        } else if (
          (e.clientY > page.getBoundingClientRect().height &&
            Math.round(page.scrollTop + page.getBoundingClientRect().height) !==
              page.scrollHeight) ||
          (e.clientX > page.getBoundingClientRect().width &&
            Math.round(page.scrollLeft + page.getBoundingClientRect().width) !==
              page.scrollWidth &&
            pageView === "list")
        ) {
          scrollOnDrag = setInterval(() => {
            if (pageView !== "list") {
              page.scroll(0, page.scrollTop + 100);
            } else {
              page.scroll(page.scrollLeft + 100, 0);
            }
            changeBoxDimensions(
              box,
              anchorY,
              anchorX,
              Math.min(page.scrollTop + currentPositionY, page.scrollHeight),
              currentPositionX
            );
            // myOther(box);
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
  }, [pageView]);
}

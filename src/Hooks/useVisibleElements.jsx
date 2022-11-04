import { useEffect } from "react";
import { findInArray } from "../Helpers/SearchArray";

export default function useVisibleElements(
  setVisibleItems,
  selectedItems,
  visibleItems,
  directoryItems,
  pageView
) {
  function handleVisibleItems() {
    const elements = document.getElementsByClassName("page-item");
    setVisibleItems([]);
    for (const element of elements) {
      const elementDimensions = element.getBoundingClientRect();

      const notAboveScreen =
        elementDimensions.top + 500 + elementDimensions.height >= 0;
      const notBelowScreen = elementDimensions.top - 500 < window.innerHeight;
      if (notBelowScreen && notAboveScreen) {
        setVisibleItems((prevVisible) => [...prevVisible, element]);
      }
      if (!notBelowScreen) {
        break;
      }
    }
  }

  useEffect(() => {
    const pageItems = document.getElementsByClassName("page-item");
    function focusPage(e) {
      for (const element of pageItems) {
        if (findInArray(selectedItems, element, "element")) {
          element.classList.add("selected");
          element.classList.remove("alternate");
        } else {
          element.classList.remove("selected");
          element.classList.remove("alternate");
        }
      }
    }
    focusPage();
    function blurredPage() {
      for (const element of pageItems) {
        if (findInArray(selectedItems, element, "element")) {
          element.classList.add("selected");
          element.classList.add("alternate");
        } else {
          element.classList.remove("selected");
          element.classList.remove("alternate");
        }
      }
    }
    window.addEventListener("blur", blurredPage);
    window.addEventListener("focus", focusPage);
    return () => {
      window.removeEventListener("blur", blurredPage);
      window.removeEventListener("focus", focusPage);
    };
  }, [selectedItems, visibleItems]);

  useEffect(() => {
    handleVisibleItems();
  }, [directoryItems, pageView]);

  useEffect(() => {
    document
      .getElementById("display-page")
      .addEventListener("scroll", handleVisibleItems);
    return () => {
      document
        .getElementById("display-page")
        .removeEventListener("scroll", handleVisibleItems);
    };
  }, []);
}

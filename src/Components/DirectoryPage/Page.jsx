import { useContext, useEffect, useState } from "react";
import { DirectoryContext } from "../Main/App";
import contextMenuOptions from "../../Helpers/ContextMenuOptions";
import { findInArray } from "../../Helpers/SearchArray";
import CornerInfo from "./CornerInfo";

export default function Page({
  selectedItems,
  setVisibleItems,
  clipboard,
  children,
}) {
  const {
    directoryItems,
    state: { currentDirectory },
  } = useContext(DirectoryContext);

  useEffect(() => {
    const pageBlocks = document.getElementsByClassName("display-page-block");
    function focusPage(e) {
      for (const element of pageBlocks) {
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
      for (const element of pageBlocks) {
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
  }, [selectedItems]);

  function handleVisibleItems() {
    const elements = document.getElementsByClassName("display-page-block");
    setVisibleItems([]);
    for (const element of elements) {
      const elementDimensions = element.getBoundingClientRect();

      const notAboveScreen =
        elementDimensions.top + elementDimensions.height + 1000 >= 0;
      const notBelowScreen = elementDimensions.top - 1000 < window.innerHeight;
      if (notBelowScreen && notAboveScreen) {
        setVisibleItems((prevVisible) => [...prevVisible, element]);
      }
      if (!notBelowScreen) {
        break;
      }
    }
  }

  useEffect(() => {
    handleVisibleItems();
  }, [directoryItems]);

  return (
    <div
      id="display-page"
      onScroll={() => {
        handleVisibleItems();
      }}
      data-contextmenu={contextMenuOptions()}
      data-info={JSON.stringify({
        isDirectory: true,
        path: currentDirectory,
      })}
      data-destination={JSON.stringify({
        destination: currentDirectory,
      })}
    >
      <div id="select-multiple-box" />
      {children}
      {!directoryItems.length && (
        <h1 id="empty-directory-header">
          {currentDirectory === "Trash" ? "Trash" : "Folder"} is empty
        </h1>
      )}
      <CornerInfo
        clipboard={clipboard}
        selectedItems={selectedItems}
        directoryItems={directoryItems}
      />
    </div>
  );
}

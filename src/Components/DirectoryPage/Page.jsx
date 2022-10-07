import React, { useContext, useEffect, useState } from "react";
import { DirectoryContext } from "../Main/App";
import contextMenuOptions from "../../Helpers/ContextMenuOptions";
import { findInArray } from "../../Helpers/SearchArray";

export default function Page({ selectedItems, setVisibleItems, children }) {
  const { directoryItems, state, setDirectoryItems } =
    useContext(DirectoryContext);

  useEffect(() => {
    const pageBlocks = document.getElementsByClassName("display-page-block");
    for (const element of pageBlocks) {
      if (findInArray(selectedItems, element, "element")) {
        element.classList.add("selected");
      } else {
        element.classList.remove("selected");
      }
    }
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
        path: state.currentDirectory,
      })}
      data-destination={JSON.stringify({ destination: state.currentDirectory })}
    >
      <div id="select-multiple-box" />
      {directoryItems[0]?.err ? (
        <h1 id="does-not-exist-error">{directoryItems[0].err}</h1>
      ) : (
        children
      )}
      {!directoryItems.length && (
        <h1 id="empty-directory-header">Folder is empty</h1>
      )}
    </div>
  );
}

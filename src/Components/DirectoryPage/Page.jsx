import React, { useContext, useEffect, useState, lazy, Suspense } from "react";
import { DirectoryContext } from "../Main/App";
import contextMenuOptions from "../../Helpers/ContextMenuOptions";
import { findInArray } from "../../Helpers/SearchArray";
const FilesAndDirectories = lazy(() => import("./FilesAndDirectories"));

export default function Page() {
  const { directoryItems, state, itemsSelected } = useContext(DirectoryContext);

  useEffect(() => {
    const pageBlocks = document.getElementsByClassName("display-page-block");
    for (const element of pageBlocks) {
      if (findInArray(itemsSelected, element, "element")) {
        element.classList.add("selected");
      } else {
        element.classList.remove("selected");
      }
    }
  }, [itemsSelected]);

  const renderDirectoryItems = directoryItems.map((directoryItem, index) => {
    return (
      <FilesAndDirectories
        key={directoryItem.key || directoryItem.name}
        directoryItem={directoryItem}
      />
    );
  });
  return (
    <div
      id="display-page"
      data-contextmenu={contextMenuOptions()}
      data-info={JSON.stringify({
        isDirectory: true,
        location: state.currentDirectory,
      })}
      data-destination={JSON.stringify({ destination: state.currentDirectory })}
    >
      <div id="select-multiple-box" />
      {directoryItems[0]?.err ? (
        <h1 id="does-not-exist-error">{directoryItems[0].err}</h1>
      ) : (
        renderDirectoryItems
      )}
      {!directoryItems.length && (
        <h1 id="empty-directory-header">Folder is empty</h1>
      )}
    </div>
  );
}

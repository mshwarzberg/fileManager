import React, { useContext, useEffect, useState } from "react";
import { DirectoryContext } from "../Main/App";
import contextMenuOptions from "../../Helpers/ContextMenuOptions";
import { findInItemsSelected } from "../../Helpers/SearchArray";
import FilesAndDirectories from "./FilesAndDirectories";

export default function Page() {
  const { directoryItems, state, itemsSelected } = useContext(DirectoryContext);

  useEffect(() => {
    const pageBlocks = document.getElementsByClassName("display-page-block");
    for (const element of pageBlocks) {
      if (findInItemsSelected(itemsSelected, element, "element")) {
        element.classList.add("selected");
      } else {
        element.classList.remove("selected");
      }
    }
  }, [itemsSelected]);

  const renderDirectoryItems = directoryItems.map((directoryItem) => {
    return (
      <FilesAndDirectories
        key={directoryItem.key}
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
        path: state.currentDirectory,
      })}
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

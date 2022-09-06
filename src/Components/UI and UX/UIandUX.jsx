import React, { useState, createContext, useContext, useEffect } from "react";
import ContextMenu from "../ContextMenu/ContextMenu";

import { DirectoryContext } from "../Main/App";
import CustomTitle from "./CustomTitle";
import useSelectMultiple from "../../Hooks/useSelectMultiple";
import useShortcuts from "../../Hooks/useShortcuts";
import generateThumbnails from "../../Helpers/FS and OS/GenerateThumbnails";
import UIandUXState from "./UIandUXState";
import useScaleDirectoryTree from "../../Hooks/useScaleDirectoryTree";
import useRenameElement from "../../Hooks/useRename";
import useWatch from "../../Hooks/useWatch";

export const UIContext = createContext();

const fs = window.require("fs");

export default function UIandUX({ visibleItems, setVisibleItems }) {
  const [contextMenu, setContextMenu] = useState({});
  const [title, setTitle] = useState({});
  const [showProperties, setShowProperties] = useState();
  const [popup, setPopup] = useState({});
  const [clipboardData, setClipboardData] = useState({});
  const [showSettings, setShowSettings] = useState();
  const [dragAndDrop, setDragAndDrop] = useState();

  const { setLastSelected, itemsSelected, state, directoryItems } =
    useContext(DirectoryContext);

  function addToVisibleItems() {
    const pageBlocks = document.getElementsByClassName("display-page-block");
    const visibleArray = [];
    for (const block of pageBlocks) {
      const blockDimensions = block.getBoundingClientRect();
      if (
        window.innerHeight > blockDimensions.top &&
        blockDimensions.top + blockDimensions.height > 0
      ) {
        visibleArray.push(block);
      }
      if (window.innerHeight < blockDimensions.top) {
        break;
      }
    }

    setVisibleItems(visibleArray);
    for (const element of visibleArray) {
      const info = JSON.parse(element.dataset.info || "{}");
      if (info.isMedia && info.size > 300000) {
        try {
          fs.accessSync(info.thumbPath);
        } catch {
          generateThumbnails(
            state.drive,
            state.currentDirectory,
            info.prefix,
            info.fileextension
          );
        }
      }
    }
  }
  useEffect(() => {
    const page = document.getElementById("display-page");
    page.addEventListener("scroll", addToVisibleItems);
    return () => {
      page.removeEventListener("scroll", addToVisibleItems);
    };
  }, [visibleItems, state.currentDirectory]);

  useEffect(() => {
    addToVisibleItems();
  }, [directoryItems]);

  useWatch();
  useScaleDirectoryTree();
  useSelectMultiple(setLastSelected, visibleItems);
  useShortcuts(itemsSelected, setClipboardData, clipboardData);
  useRenameElement();
  return (
    <UIContext.Provider
      value={{
        contextMenu,
        setContextMenu,
        popup,
        setPopup,
        clipboardData,
        setClipboardData,
      }}
    >
      <CustomTitle />
      <ContextMenu />
    </UIContext.Provider>
  );
}

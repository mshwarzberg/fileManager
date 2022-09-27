import React, { useState, createContext, useContext, useEffect } from "react";
import ContextMenu from "../ContextMenu/ContextMenu";

import { DirectoryContext } from "../Main/App";
import CustomTitle from "./CustomTitle";
import useSelectMultiple from "../../Hooks/useSelectMultiple";
import useShortcuts from "../../Hooks/useShortcuts";
import UIandUXState from "./UIandUXState";
import useScaleDirectoryTree from "../../Hooks/useScaleDirectoryTree";
import useWatch from "../../Hooks/useWatch";

export const UIContext = createContext();

export default function UIandUX() {
  const [contextMenu, setContextMenu] = useState({});
  const [title, setTitle] = useState({});
  const [showProperties, setShowProperties] = useState();
  const [popup, setPopup] = useState({});
  const [showSettings, setShowSettings] = useState();
  const [dragAndDrop, setDragAndDrop] = useState();
  const [clipboardData, setClipboardData] = useState({});

  const {
    setLastSelected,
    itemsSelected,
    state,
    directoryItems,
    setItemsSelected,
  } = useContext(DirectoryContext);

  useWatch();
  useScaleDirectoryTree();
  useSelectMultiple(setLastSelected);
  useShortcuts(itemsSelected, setClipboardData, clipboardData);

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

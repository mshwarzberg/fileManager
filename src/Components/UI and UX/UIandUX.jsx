import React, { useState, createContext } from "react";
import ContextMenu from "../ContextMenu/ContextMenu";

import CustomTitle from "./CustomTitle";
import useSelectMultiple from "../../Hooks/useSelectMultiple";
import useShortcuts from "../../Hooks/useShortcuts";
import useScaleDirectoryTree from "../../Hooks/useScaleDirectoryTree";
import useWatch from "../../Hooks/useWatch";

export const UIContext = createContext();

export default function UIandUX({
  setLastSelected,
  selectedItems,
  setSelectedItems,
}) {
  const [contextMenu, setContextMenu] = useState({});
  const [clipboardData, setClipboardData] = useState({});

  useWatch();
  useScaleDirectoryTree();
  useSelectMultiple(setLastSelected, setSelectedItems);
  useShortcuts(
    selectedItems,
    setClipboardData,
    clipboardData,
    setSelectedItems
  );

  return (
    <UIContext.Provider
      value={{
        contextMenu,
        setContextMenu,
        clipboardData,
        setClipboardData,
      }}
    >
      <CustomTitle />
      <ContextMenu
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
      />
    </UIContext.Provider>
  );
}

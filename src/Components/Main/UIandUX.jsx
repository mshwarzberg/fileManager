import { useState, createContext, useEffect } from "react";
import ContextMenu from "../ContextMenu/ContextMenu";

import CustomTitle from "../Miscellaneous/CustomTitle";
import useSelectMultiple from "../../Hooks/useSelectMultiple";
import useShortcuts from "../../Hooks/useShortcuts";
import useScaleDirectoryTree from "../../Hooks/useScaleDirectoryTree";
import useWatch from "../../Hooks/useWatch";
import Popup from "../Miscellaneous/Popup";

export const UIContext = createContext();

export default function UIandUX({
  setLastSelected,
  selectedItems,
  setSelectedItems,
  popup,
  setPopup,
  clipboard,
  setClipboard,
}) {
  const [contextMenu, setContextMenu] = useState({});

  useWatch();
  useScaleDirectoryTree();
  useSelectMultiple(setLastSelected, setSelectedItems);
  useShortcuts(
    selectedItems,
    setClipboard,
    clipboard,
    setSelectedItems,
    setPopup,
    popup
  );

  useEffect(() => {
    setClipboard(JSON.parse(sessionStorage.getItem("clipboard") || "{}"));
  }, []);

  useEffect(() => {
    const pageBlocks = document.getElementsByClassName("display-page-block");
    if (clipboard.mode === "cut") {
      for (const item of pageBlocks) {
        if (
          clipboard.info
            .map((item) => {
              return item.path;
            })
            .includes(item.id)
        ) {
          item.style.opacity = 0.6;
        } else {
          item.style.opacity = 1;
        }
      }
    } else {
      for (const item of pageBlocks) {
        item.style.opacity = 1;
      }
    }
    sessionStorage.setItem("clipboard", JSON.stringify(clipboard));
  }, [clipboard]);

  return (
    <UIContext.Provider
      value={{
        contextMenu,
        setContextMenu,
        clipboard,
        setClipboard,
        popup,
        setPopup,
      }}
    >
      {popup.show && <Popup popup={popup} setPopup={setPopup} />}
      <CustomTitle />
      <ContextMenu
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        setPopup={setPopup}
      />
    </UIContext.Provider>
  );
}

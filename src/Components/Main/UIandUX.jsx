import { useState, createContext, useEffect, useContext } from "react";

import { GeneralContext } from "./App";

import useSelectMultiple from "../../Hooks/useSelectMultiple";
import useShortcuts from "../../Hooks/useShortcuts";
import useScaleDirectoryTree from "../../Hooks/useScaleDirectoryTree";
import useWatch from "../../Hooks/useWatch";
import useDragAndDrop from "../../Hooks/useDragAndDrop";
import Popup from "../Miscellaneous/Popup";
import Title from "../Miscellaneous/Title";
import Settings from "../Miscellaneous/Settings/Settings";
import ContextMenu from "../ContextMenu/ContextMenu";

export const UIContext = createContext();

export default function UIandUX({
  lastSelected: [lastSelected, setLastSelected = () => {}],
  selectedItems: [selectedItems, setSelectedItems = () => {}],
  popup: [popup, setPopup = () => {}],
  clipboard: [clipboard, setClipboard = () => {}],
  drag: [drag, setDrag = () => {}],
  reload: [reload, setReload = () => {}],
}) {
  const {
    state: { currentDirectory },
    dispatch,
  } = useContext(GeneralContext);
  const [contextMenu, setContextMenu] = useState({});

  useEffect(() => {
    setClipboard(JSON.parse(sessionStorage.getItem("clipboard") || "{}"));
  }, []);

  useEffect(() => {
    const pageBlocks = document.getElementsByClassName("display-page-block");
    if (clipboard.mode === "move") {
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

  useWatch();
  useScaleDirectoryTree();
  useSelectMultiple(setLastSelected, setSelectedItems);
  useShortcuts(
    [selectedItems, setSelectedItems],
    [clipboard, setClipboard],
    [popup, setPopup],
    setReload
  );
  useDragAndDrop(
    [selectedItems, setSelectedItems],
    [drag, setDrag],
    currentDirectory,
    setPopup,
    dispatch
  );

  return (
    <UIContext.Provider
      value={{
        contextMenu,
        setContextMenu,
        clipboard,
        setClipboard,
        setPopup,
      }}
    >
      {popup.body && <Popup popup={popup} setPopup={setPopup} />}
      {!drag.x && !drag.y && <Title />}
      <ContextMenu
        selectedItems={selectedItems}
        setPopup={setPopup}
        setReload={setReload}
      />
      <Settings setPopup={setPopup} />
    </UIContext.Provider>
  );
}

import { useState, createContext, useEffect, useContext } from "react";

import { GeneralContext } from "./App";

import useSelectMultiple from "../../Hooks/useSelectMultiple";
import useShortcuts from "../../Hooks/useShortcuts";
import useScaleDirectoryTree from "../../Hooks/useScaleDirectoryTree";
import useWatch from "../../Hooks/useWatch";
import useDragAndDrop from "../../Hooks/useDragAndDrop";
import useVisibleElements from "../../Hooks/useVisibleElements";

import Popup from "../Miscellaneous/Popup";
import Title from "../Miscellaneous/Title";
import SettingsButton from "../Miscellaneous/Settings/SettingsButton";
import ContextMenu from "../ContextMenu/ContextMenu";

export const UIContext = createContext();

export default function UIandUX({
  visibleItems: [visibleItems, setVisibleItems = () => {}],
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
    directoryItems,
    settings: { pageView },
  } = useContext(GeneralContext);
  const [contextMenu, setContextMenu] = useState({});

  useEffect(() => {
    setClipboard(JSON.parse(sessionStorage.getItem("clipboard") || "{}"));
  }, []);

  useEffect(() => {
    const pageItems = document.getElementsByClassName("page-item");
    if (clipboard.mode === "move") {
      for (const item of pageItems) {
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
      for (const item of pageItems) {
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
  useVisibleElements(
    setVisibleItems,
    selectedItems,
    visibleItems,
    directoryItems,
    pageView
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
      <SettingsButton setPopup={setPopup} />
    </UIContext.Provider>
  );
}

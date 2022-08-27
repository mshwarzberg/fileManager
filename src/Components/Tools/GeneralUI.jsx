import React, { useState, createContext, useContext, useEffect } from "react";
import ContextMenu from "./ContextMenu/ContextMenu";
import CustomTitle from "./CustomTitle";
import useContainWithinScreen from "../../Hooks/useContainWithinScreen";
import Properties from "./ContextMenu/Functions/Properties";

import Prompt from "./ContextMenu/Functions/Popups/Prompt";
import Confirm from "./ContextMenu/Functions/Popups/Confirm";
import Alert from "./ContextMenu/Functions/Popups/Alert";

import useShortcuts from "../../Hooks/useShortcuts";
import useDragItems from "../../Hooks/useDragItems";
import useSelectMultiple from "../../Hooks/useSelectMultiple";
import useScaleDirectoryTree from "../../Hooks/useScaleDirectoryTree";

import { GeneralContext } from "../Main/App";
import GearIcon from "../../Assets/images/gear.png";
import Settings from "./Settings/Settings";

export const UIContext = createContext();

export default function GeneralUI({ showTree }) {
  const [contextMenu, setContextMenu] = useState({});
  const [title, setTitle] = useState({});
  const [showProperties, setShowProperties] = useState();
  const [popup, setPopup] = useState({});
  const [clipboardData, setClipboardData] = useState({});
  const [showSettings, setShowSettings] = useState();
  const [dragAndDrop, setDragAndDrop] = useState();
  const [cornerMessage, setCornerMessage] = useState();

  const { itemsSelected } = useContext(GeneralContext);

  useEffect(() => {
    if (itemsSelected.length > 1) {
      setCornerMessage(`${itemsSelected.length} items selected`);
    }
    const messageTimeout = setTimeout(() => {
      setCornerMessage();
    }, 3000);
    return () => {
      clearTimeout(messageTimeout);
    };
  }, [itemsSelected]);
  useContainWithinScreen("#menu", setContextMenu, [
    contextMenu.x,
    contextMenu.y,
  ]);
  useContainWithinScreen("#custom-title", setTitle, [title.title]);

  useShortcuts(setClipboardData, setContextMenu, clipboardData);
  useDragItems(setPopup, dragAndDrop, setDragAndDrop);
  useSelectMultiple();
  useScaleDirectoryTree(showTree);

  return (
    <UIContext.Provider
      value={{
        contextMenu,
        setContextMenu,
        popup,
        setPopup,
        setCornerMessage,
      }}
    >
      <div
        id="settings"
        onClick={() => {
          setShowSettings(true);
        }}
      >
        <img src={GearIcon} alt="" />
      </div>
      <div id="drag-and-drop-box">{itemsSelected.length}</div>
      {showSettings && <Settings setShowSettings={setShowSettings} />}
      {popup.type === "alert" && <Alert />}
      {popup.type === "confirm" && <Confirm />}
      {popup.type === "prompt" && <Prompt />}
      <ContextMenu
        setShowProperties={setShowProperties}
        clipboardData={clipboardData}
        setClipboardData={setClipboardData}
      />
      <CustomTitle
        contextMenu={contextMenu}
        title={title}
        setTitle={setTitle}
      />
      {showProperties && (
        <Properties
          showProperties={showProperties}
          setShowProperties={setShowProperties}
        />
      )}
      {cornerMessage && <div id="corner-message">{cornerMessage}</div>}
    </UIContext.Provider>
  );
}

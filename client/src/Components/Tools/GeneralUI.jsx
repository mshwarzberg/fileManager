import React, { useState, createContext } from "react";
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

import GearIcon from "../../Assets/images/gear.png";
import Settings from "./Settings";

export const UIContext = createContext();

export default function GeneralUI({ showTree, setBackgroundFade }) {
  const [contextMenu, setContextMenu] = useState({});
  const [title, setTitle] = useState({});
  const [showProperties, setShowProperties] = useState();
  const [prompt, setPrompt] = useState({});
  const [confirm, setConfirm] = useState({});
  const [alert, setAlert] = useState({});
  const [clipboardData, setClipboardData] = useState({});
  const [dragCount, setDragCount] = useState();
  const [showSettings, setShowSettings] = useState();

  useContainWithinScreen("#menu", setContextMenu, [
    contextMenu.x,
    contextMenu.y,
  ]);
  useContainWithinScreen("#custom-title", setTitle, [title.title]);

  useShortcuts(
    setClipboardData,
    setContextMenu,
    setConfirm,
    setAlert,
    clipboardData
  );
  useDragItems(setDragCount, dragCount, setAlert, setConfirm);
  useSelectMultiple();
  useScaleDirectoryTree(showTree, setBackgroundFade);

  return (
    <UIContext.Provider
      value={{
        contextMenu,
        setContextMenu,
        prompt,
        setPrompt,
        confirm,
        setConfirm,
        alert,
        setAlert,
      }}
    >
      {dragCount && (
        <div id="drag-count">
          {dragCount}
          <div />
        </div>
      )}
      <div
        id="settings"
        onClick={() => {
          setShowSettings(true);
        }}
      >
        <img src={GearIcon} alt="" />
      </div>
      {showSettings && <Settings setShowSettings={setShowSettings} />}
      <Alert />
      <Confirm />
      <Prompt />
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
    </UIContext.Provider>
  );
}

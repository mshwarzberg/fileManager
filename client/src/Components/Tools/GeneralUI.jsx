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

export const UIContext = createContext();

export default function GeneralUI() {
  const [contextMenu, setContextMenu] = useState({});
  const [title, setTitle] = useState({});
  const [showProperties, setShowProperties] = useState(false);
  const [prompt, setPrompt] = useState({});
  const [confirm, setConfirm] = useState({});
  const [alert, setAlert] = useState({});
  const [clipboardData, setClipboardData] = useState({});

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
  useDragItems();
  useSelectMultiple();

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

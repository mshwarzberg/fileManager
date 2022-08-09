import React, { useState, createContext } from "react";
import ContextMenu from "./ContextMenu/ContextMenu";
import CustomTitle from "./CustomTitle";
import useContainWithinScreen from "../../Hooks/useContainWithinScreen";
import Properties from "./ContextMenu/Functions/Properties";
import Prompt from "./ContextMenu/Functions/Popups/Prompt";
import Confirm from "./ContextMenu/Functions/Popups/Confirm";

export const UIContext = createContext();

export default function GeneralUI({ itemsSelected, setItemsSelected }) {
  const [contextMenu, setContextMenu] = useState({});
  const [title, setTitle] = useState({});
  const [showProperties, setShowProperties] = useState(false);
  const [prompt, setPrompt] = useState({});
  const [shortcut, setShortcut] = useState();
  const [confirm, setConfirm] = useState({});

  useContainWithinScreen("#menu", setContextMenu, [
    contextMenu.x,
    contextMenu.y,
  ]);
  useContainWithinScreen("#custom-title", setTitle, [title.title]);

  return (
    <UIContext.Provider
      value={{
        itemsSelected,
        setItemsSelected,
        contextMenu,
        setContextMenu,
        prompt,
        setPrompt,
        shortcut,
        setShortcut,
        confirm,
        setConfirm,
      }}
    >
      <Confirm />
      <Prompt />
      <ContextMenu setShowProperties={setShowProperties} />
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

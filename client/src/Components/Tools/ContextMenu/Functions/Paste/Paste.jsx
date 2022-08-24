import React, { useContext } from "react";
import { GeneralContext } from "../../../../Main/App";
import { UIContext } from "../../../GeneralUI";
import PasteFunction from "./PasteFunction";

export default function Paste({ clipboardData, setClipboardData }) {
  const { setDirectoryItems, state, directoryItems } =
    useContext(GeneralContext);
  const { contextMenu, setContextMenu, setPopup } = useContext(UIContext);

  return (
    <button
      className="context-menu-item"
      onClick={() => {
        PasteFunction(
          clipboardData.source,
          contextMenu.destination,
          clipboardData.mode,
          state.currentDirectory,
          {
            setDirectoryItems: setDirectoryItems,
            setPopup: setPopup,
            setContextMenu: setContextMenu,
            setClipboardData: setClipboardData,
          }
        );
      }}
    >
      {contextMenu.info.name ? "Paste Into Folder" : "Paste"}
    </button>
  );
}

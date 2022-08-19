import React, { useContext } from "react";
import { GeneralContext } from "../../../../Main/App";
import { UIContext } from "../../../GeneralUI";
import PasteFunction from "./PasteFunction";

export default function Paste({ clipboardData, setClipboardData }) {
  const { setDirectoryItems, state, directoryItems } =
    useContext(GeneralContext);
  const { contextMenu, setContextMenu, setConfirm, setAlert } =
    useContext(UIContext);

  return (
    <button
      className="context-menu-item"
      onClick={() => {
        PasteFunction(
          clipboardData.source,
          contextMenu.destination,
          clipboardData.mode,
          state.currentDirectory,
          directoryItems,
          {
            setDirectoryItems: setDirectoryItems,
            setConfirm: setConfirm,
            setAlert: setAlert,
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

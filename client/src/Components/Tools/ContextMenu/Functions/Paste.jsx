import React, { useContext } from "react";
import { GeneralContext } from "../../../Main/App";
import TransferFunction from "../../../../Helpers/TransferFunction";

export default function Paste({
  clipboardData,
  setClipboardData,
  contextMenu,
  setContextMenu,
}) {
  const { setDirectoryItems, state } = useContext(GeneralContext);

  return (
    <button
      className="context-menu-item"
      onClick={() => {
        TransferFunction(
          [clipboardData.metadata],
          contextMenu.info.path,
          clipboardData.mode,
          state.currentDirectory,
          setDirectoryItems
        );
        if (clipboardData.mode === "cut") {
          setClipboardData({});
        }
        setContextMenu({});
      }}
    >
      {contextMenu.info.path !== state.currentDirectory
        ? "Paste Into Folder"
        : "Paste"}
    </button>
  );
}

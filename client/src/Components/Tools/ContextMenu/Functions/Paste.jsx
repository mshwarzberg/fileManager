import React, { useContext } from "react";
import { DirectoryContext } from "../../../Main/App";
import TransferFunction from "./TransferFunction";

export default function Paste({
  clipboardData,
  setClipboardData,
  contextMenu,
}) {
  const { setDirectoryItems, state } = useContext(DirectoryContext);

  let destination;
  if (contextMenu) {
    destination = contextMenu.info.destination + clipboardData.metadata.name;
  } else {
    destination = clipboardData.metadata.destination;
  }
  return (
    <button
      className="context-menu-item"
      onClick={() => {
        TransferFunction(
          clipboardData,
          destination,
          contextMenu,
          setDirectoryItems,
          setClipboardData,
          state
        );
      }}
    >
      Paste&nbsp;
      {contextMenu.info.destination !== state.currentDirectory
        ? "Into Folder"
        : ""}
    </button>
  );
}

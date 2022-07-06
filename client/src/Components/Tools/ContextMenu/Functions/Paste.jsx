import React, { useContext } from "react";
import { DirectoryContext } from "../../../Main/App";

export default function Paste({
  clipboardData,
  setClipboardData,
  contextMenu,
  setContextMenu,
}) {
  const { setDirectoryItems, state } = useContext(DirectoryContext);

  return (
    <button
      className="context-menu-item"
      onClick={() => {
        setContextMenu({});
        fetch("/api/manage/transfer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: clipboardData.source,
            destination:
              contextMenu.info.destination + clipboardData.metadata.name,
            mode: clipboardData.mode,
            isDirectory: clipboardData.isSourceDirectory,
          }),
        })
          .then((res) => {
            if (res.status === 409) {
              alert("File already exists");
              return;
            } else if (res.status === 500) {
              alert("Error occurred");
              return;
            }
            if (state.currentDirectory === contextMenu.info.destination) {
              setDirectoryItems((prevItems) => [
                ...prevItems,
                {
                  ...clipboardData.metadata,
                  path: state.currentDirectory + clipboardData.metadata.name,
                },
              ]);
            } else if (
              state.currentDirectory !== contextMenu.info.destination &&
              clipboardData.mode === "cut"
            ) {
              setDirectoryItems((prevItems) => {
                return prevItems.map((prevItem) => {
                  if (prevItem.name === clipboardData.metadata.name) {
                    return {};
                  }
                  return prevItem;
                });
              });
            }
            if (clipboardData.mode === "cut") {
              setClipboardData({});
            }
          })
          .catch((e) => {
            alert(e.toString());
          });
      }}
    >
      Paste{" "}
      {contextMenu.info.destination !== state.currentDirectory
        ? "Into Folder"
        : ""}
    </button>
  );
}

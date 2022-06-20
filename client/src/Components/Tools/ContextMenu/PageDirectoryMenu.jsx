import React, { useContext } from "react";
import { DirectoryContext } from "../../Main/App";
import CutAndCopy from "./Functions/CutAndCopy";
import Delete from "./Functions/Delete";
import Rename from "./Functions/Rename";

export default function PageDirectoryMenu({
  setContextMenu,
  contextMenu,
  setShowProperties,
  clipboardData,
  setClipboardData,
}) {
  const { state, setDirectoryItems, directoryItems } =
    useContext(DirectoryContext);

  return (
    <div id="menu" style={{ top: contextMenu.y, left: contextMenu.x }}>
      {!contextMenu.isDirectory && (
        <button className="context-menu-item">New Folder</button>
      )}
      {contextMenu.isDirectory && (
        <>
          <Rename originalItem={directoryItems[contextMenu.directoryIndex]} />
          <CutAndCopy
            contextMenu={contextMenu}
            setContextMenu={setContextMenu}
            setClipboardData={setClipboardData}
            path={contextMenu.targetPath}
            mode="cut"
          />
          <CutAndCopy
            contextMenu={contextMenu}
            setContextMenu={setContextMenu}
            setClipboardData={setClipboardData}
            path={contextMenu.targetPath}
            mode="copy"
          />
          <Delete contextMenu={contextMenu} path={contextMenu.targetPath} />
        </>
      )}
      {contextMenu.targetPath && (
        <button
          className="context-menu-item"
          onClick={() => {
            let filename = clipboardData.path;
            for (let i = filename.length; i >= 0; i--) {
              if (filename[i] === "/") {
                filename = filename.slice(i + 1, filename.length);
                break;
              }
            }
            fetch("/api/manage/transfer", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                path: clipboardData.path,
                destination: contextMenu.targetPath,
                name: filename,
                mode: clipboardData.mode,
                isDirectory: contextMenu.isDirectory,
              }),
            })
              .then(async (res) => {
                const response = await res.json();
                if (response.err) {
                  return alert(response.err);
                }
                if (state.currentDirectory === contextMenu.targetPath) {
                  setDirectoryItems((prevItems) => [...prevItems, response]);
                } else if (
                  clipboardData.mode === "cut" &&
                  state.currentDirectory !== contextMenu.targetPath
                ) {
                  setDirectoryItems((prevItems) => {
                    return prevItems.map((item) => {
                      if (item.path === clipboardData.path) {
                        return {};
                      }
                      return item;
                    });
                  });
                }
                if (clipboardData.mode === "cut") {
                  setClipboardData();
                }
              })
              .catch(() => {
                return;
              });
            setContextMenu({});
          }}
        >
          Paste
        </button>
      )}
      <button
        className="context-menu-item"
        onClick={() => {
          setShowProperties(true);
        }}
      >
        Properties
      </button>
    </div>
  );
}

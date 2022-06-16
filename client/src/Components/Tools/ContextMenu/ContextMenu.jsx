import React, { useEffect, useState, useContext } from "react";
import { DirectoryContext } from "../../Main/App";
import FileMenu from "./FileMenu";
import FileProperties from "./FileProperties";
import PageDirectoryMenu from "./PageDirectoryMenu";

export default function ContextMenu() {
  const [showProperties, setShowProperties] = useState(false);
  const [clipboardData, setClipboardData] = useState();
  const [contextMenu, setContextMenu] = useState({
    show: false,
    posX: null,
    posY: null,
    targetIndex: null,
  });

  const { state } = useContext(DirectoryContext);

  useEffect(() => {
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
    window.addEventListener("blur", () => {
      setContextMenu({});
    });
    document.addEventListener("mousedown", (e) => {
      if (e.button === 2) {
        if (e.target.dataset.index && e.target.dataset.permission === "true") {
          setShowProperties(false);
          setContextMenu({
            type: "icon",
            posX: e.clientX,
            posY: e.clientY,
            targetIndex: e.target.dataset.index,
          });
          return;
        }
        if (e.target.id === "renderitem--page" || e.target.dataset.path) {
          setContextMenu({
            targetPath: e.target.dataset.path || state.currentDirectory,
            posX: e.clientX,
            posY: e.clientY,
            isDirectory: e.target.id !== "renderitem--page",
            directoryIndex: e.target.dataset.index,
            ...(clipboardData && { ...clipboardData }),
          });
        }
      }
      if (e.button === 0 && e.target.className !== "context-menu-item") {
        return setContextMenu({});
      }
    });
    return () => {
      document.removeEventListener("contextmenu", () => {});
      document.removeEventListener("mousedown", () => {});
      window.removeEventListener("blur", () => {});
    };
  }, [clipboardData, state.currentDirectory]);

  return (
    <>
      {contextMenu.type === "icon" && (
        <FileMenu
          contextMenu={contextMenu}
          setShowProperties={setShowProperties}
          setClipboardData={setClipboardData}
          setContextMenu={setContextMenu}
        />
      )}
      {showProperties && (
        <FileProperties
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
          setShowProperties={setShowProperties}
          index={contextMenu.targetIndex}
        />
      )}
      {contextMenu.targetPath && (
        <PageDirectoryMenu
          contextMenu={contextMenu}
          setShowProperties={setShowProperties}
          setClipboardData={setClipboardData}
          clipboardData={clipboardData}
          setContextMenu={setContextMenu}
        />
      )}
    </>
  );
}

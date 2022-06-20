import React, { useEffect, useState, useContext } from "react";
import { DirectoryContext } from "../../Main/App";
import FileMenu from "./FileMenu";
import FileProperties from "./FileProperties";
import PageDirectoryMenu from "./PageDirectoryMenu";

export default function ContextMenu({ contextMenu, setContextMenu }) {
  const [showProperties, setShowProperties] = useState(false);
  const [clipboardData, setClipboardData] = useState();

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
        setTimeout(() => {
          if (
            e.target.dataset.index &&
            e.target.dataset.permission === "true"
          ) {
            setShowProperties(false);
            setContextMenu({
              type: "icon",
              x: e.clientX,
              y: e.clientY,
              targetIndex: e.target.dataset.index,
            });
          }
          if (e.target.id === "renderitem--page" || e.target.dataset.path) {
            setShowProperties(false);
            setContextMenu({
              targetPath: e.target.dataset.path || state.currentDirectory,
              x: e.clientX,
              y: e.clientY,
              isDirectory: e.target.id !== "renderitem--page",
              directoryIndex: e.target.dataset.index,
              ...(clipboardData && { ...clipboardData }),
            });
          }
        }, 0);
      }
      if (e.button === 0 && e.target.className !== "context-menu-item") {
        setContextMenu({});
      }
    });
    return () => {
      document.removeEventListener("contextmenu", () => {});
      document.removeEventListener("mousedown", () => {});
      window.removeEventListener("blur", () => {});
    };
    // eslint-disable-next-line
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
      {contextMenu.targetPath && (
        <PageDirectoryMenu
          contextMenu={contextMenu}
          setShowProperties={setShowProperties}
          setClipboardData={setClipboardData}
          clipboardData={clipboardData}
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
    </>
  );
}

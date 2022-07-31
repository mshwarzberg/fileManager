import React, { useEffect, useState, useContext } from "react";
import { GeneralContext } from "../../Main/App";
import Rename from "./Functions/Rename";
import Transfer from "./Functions/Transfer";
import Delete from "./Functions/Delete";
import Paste from "./Functions/Paste";
import NewDirectory from "./Functions/NewDirectory";
import Refresh from "./Functions/Refresh";
import OpenFileManager from "./Functions/OpenFileManager";

export default function ContextMenu({
  contextMenu,
  setContextMenu,
  setShowProperties,
}) {
  const [clipboardData, setClipboardData] = useState({});

  const { state } = useContext(GeneralContext);

  useEffect(() => {
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
    window.addEventListener("blur", () => {
      setContextMenu({});
    });
    document.addEventListener("mousedown", (e) => {
      if (e.button === 2 && e.target.dataset?.contextmenu) {
        setTimeout(() => {
          setContextMenu({
            items: e.target.dataset.contextmenu,
            info: JSON.parse(e.target.dataset.info),
            x: e.clientX,
            y: e.clientY,
          });
        }, 0);
        e.stopImmediatePropagation();
      } else if (e.target.className !== "context-menu-item") {
        setContextMenu({});
      }
    });
    return () => {
      document.removeEventListener("contextmenu", () => {});
      document.removeEventListener("mousedown", () => {});
      window.removeEventListener("blur", () => {});
    };
    // eslint-disable-next-line
  }, [clipboardData, state.currentDirectory, setContextMenu]);

  return (
    Object.entries(contextMenu).length && (
      <div id="menu" style={{ top: contextMenu.y, left: contextMenu.x }}>
        {contextMenu.items.includes("rename") && (
          <Rename originalItem={contextMenu.info} />
        )}
        {contextMenu.items.includes("new folder") && <NewDirectory />}
        {contextMenu.items.includes("cutcopy") && (
          <>
            <Transfer
              setClipboardData={setClipboardData}
              setContextMenu={setContextMenu}
              contextMenu={contextMenu}
              mode="cut"
              source={contextMenu.info.source}
            />
            <Transfer
              setClipboardData={setClipboardData}
              setContextMenu={setContextMenu}
              contextMenu={contextMenu}
              mode="copy"
              source={contextMenu.info.source}
            />
          </>
        )}
        {contextMenu.items.includes("paste") &&
          Object.entries(clipboardData).length > 0 && (
            <Paste
              contextMenu={contextMenu}
              setContextMenu={setContextMenu}
              clipboardData={clipboardData}
              setClipboardData={setClipboardData}
            />
          )}
        {contextMenu.items.includes("delete") && (
          <Delete info={contextMenu.info} />
        )}
        {contextMenu.items.includes("refresh") && (
          <Refresh setContextMenu={setContextMenu} />
        )}
        {contextMenu.items.includes("explorer") && (
          <OpenFileManager
            setContextMenu={setContextMenu}
            path={contextMenu.info.path}
          />
        )}
        {contextMenu.items.includes("properties") && (
          <button
            className="context-menu-item"
            onClick={() => {
              setShowProperties(true);
            }}
          >
            Properties
          </button>
        )}
      </div>
    )
  );
}

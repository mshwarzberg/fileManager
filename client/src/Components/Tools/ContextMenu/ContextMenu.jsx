import React, { useEffect, useState, useContext } from "react";
import { DirectoryContext } from "../../Main/App";
import Rename from "./Functions/Rename";
import Transfer from "./Functions/Transfer";
import Delete from "./Functions/Delete";

export default function ContextMenu({
  contextMenu,
  setContextMenu,
  setShowProperties,
}) {
  const [clipboardData, setClipboardData] = useState();

  const { state } = useContext(DirectoryContext);

  useEffect(() => {
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
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
        e.preventDefault();
      }
    });
    return () => {
      document.removeEventListener("contextmenu", () => {});
      document.removeEventListener("mousedown", () => {});
    };
    // eslint-disable-next-line
  }, [clipboardData, state.currentDirectory, setContextMenu]);

  return (
    Object.entries(contextMenu).length && (
      <div id="menu" style={{ top: contextMenu.y, left: contextMenu.x }}>
        {contextMenu.items.includes("rename") && (
          <Rename originalItem={contextMenu.info} />
        )}
        {contextMenu.items.includes("cutcopy") && (
          <>
            <Transfer
              setClipboardData={setClipboardData}
              setContextMenu={setContextMenu}
              contextMenu={contextMenu}
              mode="cut"
              path={contextMenu.info.path}
            />
            <Transfer
              setClipboardData={setClipboardData}
              setContextMenu={setContextMenu}
              contextMenu={contextMenu}
              mode="copy"
              path={contextMenu.info.path}
            />
          </>
        )}
        {contextMenu.items.includes("delete") && (
          <Delete info={contextMenu.info} />
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

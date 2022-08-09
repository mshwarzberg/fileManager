import React, { useEffect, useState, useContext } from "react";
import { GeneralContext } from "../../Main/App";
import { UIContext } from "../GeneralUI";
import Rename from "./Functions/Rename";
import Transfer from "./Functions/Transfer";
import Delete from "./Functions/Delete";
import Paste from "./Functions/Paste";
import Refresh from "./Functions/Refresh";
import OpenFileManager from "./Functions/OpenFileManager";
import View from "./Functions/View";
import NewDirectory from "./Functions/NewDirectory";
import CheckIfExists from "../../../Helpers/CheckIfExists";

export default function ContextMenu({ setShowProperties }) {
  const [clipboardData, setClipboardData] = useState({});

  const { state } = useContext(GeneralContext);
  const {
    contextMenu,
    setContextMenu,
    setPrompt,
    setItemsSelected,
    itemsSelected,
  } = useContext(UIContext);

  useEffect(() => {
    function handleBlur() {
      setPrompt({});
      setContextMenu({});
    }
    function handleMouseDown(e) {
      if (e.button === 2 && e.target.dataset?.contextmenu) {
        const info = JSON.parse(e.target.dataset.info);
        if (!CheckIfExists(itemsSelected, info.path, "path")) {
          setItemsSelected([info]);
        }
        setContextMenu({
          items: e.target.dataset.contextmenu,
          info: info,
          x: e.clientX,
          y: e.clientY,
        });
        e.stopImmediatePropagation();
      } else if (e.target.className !== "context-menu-item") {
        setContextMenu({});
        setPrompt({});
      }
    }
    function noContextMenu(e) {
      e.preventDefault();
    }
    document.addEventListener("contextmenu", noContextMenu);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("contextmenu", noContextMenu);
      document.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("blur", handleBlur);
    };
    // eslint-disable-next-line
  }, [itemsSelected]);

  return Object.entries(contextMenu).length ? (
    <div id="menu" style={{ top: contextMenu.y, left: contextMenu.x }}>
      {contextMenu.items.includes("view") && <View />}
      {contextMenu.items.includes("rename") && <Rename />}
      {contextMenu.items.includes("new folder") && <NewDirectory />}
      {contextMenu.items.includes("cutcopy") && (
        <>
          <Transfer
            setClipboardData={setClipboardData}
            setContextMenu={setContextMenu}
            contextMenu={contextMenu}
            mode="cut"
            source={contextMenu.info.path}
          />
          <Transfer
            setClipboardData={setClipboardData}
            setContextMenu={setContextMenu}
            contextMenu={contextMenu}
            mode="copy"
            source={contextMenu.info.path}
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
          item={contextMenu.info}
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
  ) : (
    <></>
  );
}

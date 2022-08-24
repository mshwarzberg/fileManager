import React, { useEffect, useContext } from "react";
import { UIContext } from "../GeneralUI";
import Rename from "./Functions/Rename";
import Transfer from "./Functions/Transfer";
import Delete from "./Functions/Delete";
import Paste from "./Functions/Paste/Paste";
import Refresh from "./Functions/Refresh";
import OpenFileManager from "./Functions/OpenFileManager";
import View from "./Functions/View";
import NewDirectory from "./Functions/NewDirectory";
import { foundInArrayObject } from "../../../Helpers/SearchArray";
import { GeneralContext } from "../../Main/App";

export default function ContextMenu({
  setShowProperties,
  clipboardData,
  setClipboardData,
}) {
  const { contextMenu, setContextMenu, setPopup } = useContext(UIContext);
  const { setItemsSelected, itemsSelected } = useContext(GeneralContext);

  useEffect(() => {
    function handleBlur() {
      setPopup({});
      setContextMenu({});
    }
    function handleMouseDown(e) {
      if (e.button === 2 && e.target.dataset.contextmenu) {
        const info = JSON.parse(
          e.target.dataset.info || e.target.dataset.destination || "{}"
        );
        if (
          !foundInArrayObject(
            itemsSelected,
            [info.name, info.path],
            ["name", "path"],
            "info"
          )
        ) {
          setItemsSelected([{ info: info, element: e.target.parentElement }]);
        }
        setContextMenu({
          items: e.target.dataset.contextmenu,
          info: info,
          destination: JSON.parse(e.target.dataset.destination || "{}").path,
          x: e.clientX,
          y: e.clientY,
        });
        e.stopImmediatePropagation();
      } else if (e.target.className !== "context-menu-item") {
        setContextMenu({});
        setPopup({});
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
      {contextMenu.items.includes("rename") && (
        <Rename oldFileName={contextMenu.info.name} />
      )}
      {contextMenu.items.includes("new folder") && <NewDirectory />}
      {contextMenu.items.includes("cutcopy") && (
        <>
          <Transfer
            setClipboardData={setClipboardData}
            setContextMenu={setContextMenu}
            mode="cut"
            source={itemsSelected}
          />
          <Transfer
            setClipboardData={setClipboardData}
            setContextMenu={setContextMenu}
            mode="copy"
            source={itemsSelected}
          />
        </>
      )}
      {contextMenu.items.includes("paste") &&
        Object.entries(clipboardData).length > 0 && (
          <Paste
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

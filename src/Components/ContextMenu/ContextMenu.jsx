import React, { useEffect, useContext } from "react";
import { UIContext } from "../UI and UX/UIandUX";
import { DirectoryContext } from "../Main/App";
import ContextMenuItem from "./ContextMenuItem";
import { findInItemsSelected } from "../../Helpers/SearchArray";
import randomID from "../../Helpers/RandomID";

export default function ContextMenu() {
  const { contextMenu, setContextMenu, setPopup } = useContext(UIContext);
  const { setItemsSelected, itemsSelected } = useContext(DirectoryContext);

  useEffect(() => {
    function handleBlur() {
      setPopup({});
    }
    function handleContextMenu(e) {
      if (e.target.dataset.contextmenu) {
        const info = JSON.parse(
          e.target.dataset.info || e.target.dataset.destination || "{}"
        );
        if (!findInItemsSelected(itemsSelected, e.target, "element")) {
          setItemsSelected([{ info: info, element: e.target }]);
        }
        setContextMenu({
          items: JSON.parse(e.target.dataset.contextmenu),
          info: info,
          destination: JSON.parse(e.target.dataset.destination || "{}")
            .destination,
          x: e.clientX,
          y: e.clientY,
        });
        e.stopImmediatePropagation();
      } else if (e.target.className !== "context-menu-item") {
        setPopup({});
      }
    }

    document.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("blur", handleBlur);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("blur", handleBlur);
    };
    // eslint-disable-next-line
  }, [itemsSelected]);

  const renderContextMenuItems = contextMenu.items?.map((item) => {
    return (
      <ContextMenuItem
        contextName={item}
        contextMenu={contextMenu}
        key={randomID()}
        clearContextMenu={() => {
          return setContextMenu({});
        }}
      />
    );
  });
  return Object.entries(contextMenu).length ? (
    <div id="context-menu" style={{ top: contextMenu.y, left: contextMenu.x }}>
      {renderContextMenuItems}
    </div>
  ) : (
    <></>
  );
}

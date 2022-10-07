import React, { useEffect, useContext } from "react";
import { UIContext } from "../UI and UX/UIandUX";
import ContextMenuItem from "./ContextMenuItem";
import { findInArray } from "../../Helpers/SearchArray";
import randomID from "../../Helpers/RandomID";

export default function ContextMenu({ selectedItems }) {
  const { contextMenu, setContextMenu, clipboardData } = useContext(UIContext);

  useEffect(() => {
    function handleBlur() {}
    function handleContextMenu(e) {
      if (e.target.dataset.contextmenu) {
        const info = JSON.parse(
          e.target.dataset.info || e.target.dataset.destination || "{}"
        );
        setTimeout(() => {
          setContextMenu({
            items: JSON.parse(e.target.dataset.contextmenu),
            info: info,
            destination: JSON.parse(e.target.dataset.destination || "{}")
              .destination,
            x: e.clientX,
            y: e.clientY,
          });
        }, 0);
        e.stopImmediatePropagation();
      } else if (e.target.className !== "context-menu-item") {
      }
    }

    document.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("blur", handleBlur);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("blur", handleBlur);
    };
    // eslint-disable-next-line
  }, [contextMenu]);

  useEffect(() => {
    if (contextMenu.items) {
      const contextMenuDimensions = document
        .getElementById("context-menu")
        .getBoundingClientRect();
      let newDimensions = {
        x: contextMenu.x,
        y: contextMenu.y,
      };
      if (
        contextMenuDimensions.width + contextMenuDimensions.left >
        window.innerWidth
      ) {
        newDimensions.x = contextMenu.x - contextMenuDimensions.width;
      }
      if (
        contextMenuDimensions.height + contextMenuDimensions.top >
        window.innerHeight
      ) {
        newDimensions.y = contextMenu.y - contextMenuDimensions.height;
      }
      setContextMenu((prevContextMenu) => ({
        ...prevContextMenu,
        ...newDimensions,
      }));
    }
  }, [contextMenu.items]);

  const renderContextMenuItems = contextMenu.items?.map((item) => {
    if (item === "Paste" && !clipboardData.info) {
      return <React.Fragment key={item} />;
    }
    return (
      <ContextMenuItem
        contextName={item}
        contextMenu={contextMenu}
        selectedItems={selectedItems}
        key={randomID()}
        clearContextMenu={() => {
          return setContextMenu({});
        }}
      />
    );
  });

  return contextMenu.items ? (
    <div id="context-menu" style={{ top: contextMenu.y, left: contextMenu.x }}>
      {renderContextMenuItems}
    </div>
  ) : (
    <></>
  );
}

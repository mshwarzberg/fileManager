import React, { useEffect, useContext } from "react";
import { UIContext } from "../UI and UX/UIandUX";
import { DirectoryContext } from "../Main/App";
import ContextMenuItem from "./ContextMenuItem";
import { findInArray } from "../../Helpers/SearchArray";
import randomID from "../../Helpers/RandomID";

export default function ContextMenu() {
  const { contextMenu, setContextMenu, setPopup, clipboardData } =
    useContext(UIContext);
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
        if (!findInArray(itemsSelected, e.target, "element")) {
          setItemsSelected([{ info: info, element: e.target }]);
        }
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
  }, [itemsSelected, contextMenu]);

  useEffect(() => {
    if (contextMenu.items) {
      const titleDimensions = document
        .getElementById("context-menu")
        .getBoundingClientRect();
      let newDimensions = {
        x: contextMenu.x,
        y: contextMenu.y,
      };
      if (titleDimensions.width + titleDimensions.left > window.innerWidth) {
        newDimensions.x = contextMenu.x - titleDimensions.width;
      }
      if (titleDimensions.height + titleDimensions.top > window.innerHeight) {
        newDimensions.y = contextMenu.y - titleDimensions.height;
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

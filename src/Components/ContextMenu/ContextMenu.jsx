import { useEffect, useContext, Fragment } from "react";
import { UIContext } from "../Main/UIandUX";
import ContextMenuItem from "./ContextMenuItem";

export default function ContextMenu({ selectedItems, setPopup, setReload }) {
  const { contextMenu, setContextMenu, clipboard } = useContext(UIContext);

  useEffect(() => {
    const page = document.getElementById("display-page");
    const directoryTree = document.getElementById("directory-tree");
    function preventScroll(e) {
      if (contextMenu.items) {
        e.preventDefault();
      }
    }
    function handleContextMenu(e) {
      if (e.target.dataset.contextmenu) {
        const info = JSON.parse(e.target.dataset.info || "{}");
        setTimeout(() => {
          setContextMenu({
            items: JSON.parse(e.target.dataset.contextmenu),
            info: info,
            destination: e.target.dataset.destination,
            x: e.clientX,
            y: e.clientY,
            element: e.target,
          });
        }, 0);
        e.stopImmediatePropagation();
      }
    }
    directoryTree?.addEventListener("wheel", preventScroll);
    page.addEventListener("wheel", preventScroll);
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      page.removeEventListener("wheel", preventScroll);
      directoryTree?.removeEventListener("wheel", preventScroll);
      document.removeEventListener("contextmenu", handleContextMenu);
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
    if (item === "Paste" && !clipboard.info) {
      return <Fragment key={item} />;
    }
    return (
      <ContextMenuItem
        contextName={item}
        contextMenu={contextMenu}
        selectedItems={selectedItems}
        key={item}
        setReload={setReload}
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

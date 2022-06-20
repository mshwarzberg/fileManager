import React, { useContext } from "react";
import { DirectoryContext } from "../../Main/App";
import CutAndCopy from "./Functions/CutAndCopy";
import Delete from "./Functions/Delete";
import Rename from "./Functions/Rename";

export default function FileMenu({
  setShowProperties,
  contextMenu,
  setClipboardData,
  setContextMenu,
}) {
  const { directoryItems } = useContext(DirectoryContext);

  return (
    <div
      id="menu"
      style={{
        top: contextMenu.y,
        left: contextMenu.x,
      }}
    >
      <Rename originalItem={directoryItems[contextMenu.targetIndex]} />
      <CutAndCopy
        setContextMenu={setContextMenu}
        setClipboardData={setClipboardData}
        path={directoryItems[contextMenu.targetIndex].path}
        mode="cut"
      />
      <CutAndCopy
        setContextMenu={setContextMenu}
        setClipboardData={setClipboardData}
        path={directoryItems[contextMenu.targetIndex].path}
        mode="copy"
      />
      <Delete
        contextMenu={contextMenu}
        path={directoryItems[contextMenu.targetIndex].path}
      />
      <button
        className="context-menu-item"
        onClick={() => {
          setShowProperties(true);
        }}
      >
        Properties
      </button>
    </div>
  );
}

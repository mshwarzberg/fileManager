import React from "react";

export default function CutAndCopy({
  setClipboardData,
  setContextMenu,
  contextMenu,
  path,
  mode,
}) {
  return (
    <button
      className="context-menu-item"
      onClick={() => {
        setClipboardData({
          path: path,
          mode: mode,
          isDirectory: contextMenu?.isDirectory,
        });
        setContextMenu({});
      }}
    >
      {mode}
    </button>
  );
}

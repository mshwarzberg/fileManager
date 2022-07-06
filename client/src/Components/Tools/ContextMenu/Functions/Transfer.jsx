import React from "react";

export default function Transfer({
  setClipboardData,
  setContextMenu,
  contextMenu,
  source,
  mode,
}) {
  return (
    <button
      className="context-menu-item"
      onClick={() => {
        setClipboardData({
          source: source,
          mode: mode,
          metadata: contextMenu.info,
          isSourceDirectory: contextMenu.info.isDirectory,
        });
        setContextMenu({});
      }}
    >
      {mode}
    </button>
  );
}

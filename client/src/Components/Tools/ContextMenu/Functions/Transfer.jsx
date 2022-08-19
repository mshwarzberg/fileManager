import React from "react";

export default function Transfer({
  setClipboardData,
  setContextMenu,
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
        });
        setContextMenu({});
      }}
    >
      {mode}
    </button>
  );
}

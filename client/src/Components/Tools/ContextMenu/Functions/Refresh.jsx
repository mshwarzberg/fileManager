import React from "react";

export default function Refresh({ setContextMenu }) {
  return (
    <button
      className="context-menu-item"
      onClick={() => {
        window.location.reload();
        setContextMenu({});
      }}
    >
      Refresh
    </button>
  );
}

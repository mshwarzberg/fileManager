import React from "react";
import { OpenWithExplorer } from "../../../RenderDirectoryItems/FS and OS/Open";

export default function OpenFileManager({ setContextMenu, item }) {
  return (
    <button
      className="context-menu-item"
      onClick={() => {
        OpenWithExplorer(item.destination + (item.name || ""), item.isFile);
        setContextMenu({});
      }}
    >
      Reveal In Explorer
    </button>
  );
}

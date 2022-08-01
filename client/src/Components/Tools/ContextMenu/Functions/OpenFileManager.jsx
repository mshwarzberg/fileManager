import React from "react";

export default function OpenFileManager({ setContextMenu, item }) {
  return (
    <button
      className="context-menu-item"
      onClick={() => {
        fetch("/api/manage/open/withexplorer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: item.path,
            isFile: item.isFile,
          }),
        });
        setContextMenu({});
      }}
    >
      Reveal In Explorer
    </button>
  );
}

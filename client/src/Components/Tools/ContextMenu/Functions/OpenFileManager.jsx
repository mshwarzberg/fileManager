import React from "react";

export default function OpenFileManager({ setContextMenu, path }) {
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
            path: path,
          }),
        });
        setContextMenu({});
      }}
    >
      Reveal In Explorer
    </button>
  );
}

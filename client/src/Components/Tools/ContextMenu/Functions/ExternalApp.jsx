import React from "react";

export default function ExternalApp({ originalItem, setContextMenu }) {
  return (
    <button
      className="context-menu-item"
      onClick={() => {
        fetch("/api/manage/open", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: originalItem.path,
          }),
        });
        setContextMenu({});
      }}
    >
      Open With App
    </button>
  );
}

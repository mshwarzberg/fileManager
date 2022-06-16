import React, { useContext } from "react";
import { DirectoryContext } from "../../../Main/App";

export default function Delete({ contextMenu, path }) {
  const { setDirectoryItems } = useContext(DirectoryContext);
  return (
    <button
      className="context-menu-item"
      onClick={(e) => {
        e.target.parentElement.style.display = "none";
        if (
          window.confirm(
            "Are you sure you want to move this item to the trash?"
          )
        ) {
          fetch("/api/manage/delete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              path: path,
            }),
          })
            .then(async (res) => {
              const response = await res.json();
              if (response.err) {
                alert(response.err);
              } else {
                setDirectoryItems((prevItems) => {
                  return prevItems.map((item) => {
                    if (
                      prevItems.indexOf(item) === contextMenu.targetIndex * 1 ||
                      contextMenu.targetPath === item.path
                    ) {
                      return {};
                    }
                    return item;
                  });
                });
              }
            })
            .catch(() => {
              return;
            });
        }
      }}
    >
      Delete
    </button>
  );
}

import React, { useContext } from "react";
import { DirectoryContext } from "../../../Main/App";

export default function Delete({ info }) {
  const { setDirectoryItems } = useContext(DirectoryContext);
  return (
    <button
      className="context-menu-item"
      onClick={() => {
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
              path: info.path,
            }),
          })
            .then(async (res) => {
              const response = await res.json();
              if (response.err) {
                alert(response.err);
              } else {
                setDirectoryItems((prevItems) => {
                  return prevItems
                    .map((item) => {
                      if (info.path === item.path && info.name === item.name) {
                        return {};
                      }
                      return item;
                    })
                    .filter((item) => {
                      return item.name && item;
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

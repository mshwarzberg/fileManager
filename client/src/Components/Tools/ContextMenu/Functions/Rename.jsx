import React, { useContext } from "react";
import { GeneralContext } from "../../../Main/App";
import { UIContext } from "../../GeneralUI";

export default function Rename({ oldFileName }) {
  const { state, setDirectoryItems } = useContext(GeneralContext);
  const { setContextMenu, setPrompt } = useContext(UIContext);

  async function renameItem(newName, oldPath) {
    return fetch("/api/manage/rename", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        originalPath: oldPath,
        newPath: state.currentDirectory + newName,
      }),
    })
      .then(async (res) => {
        const response = await res.json();
        if (response.err) {
          console.log(response.err);
          return;
        }
        setDirectoryItems((prevItems) => {
          return prevItems.map((item) => {
            if (item.path + item.name === oldPath) {
              return {
                ...item,
                name: newName,
                path: state.currentDirectory,
              };
            }
            return item;
          });
        });
      })
      .catch((e) => {})
      .finally(() => {
        setPrompt({});
        setContextMenu({});
      });
  }

  return (
    <button
      className="context-menu-item"
      onClick={() => {
        setPrompt({
          show: true,
          content: oldFileName || "",
          promptFunction: renameItem,
        });
      }}
    >
      Rename
    </button>
  );
}

import React, { useContext } from "react";
import { UIContext } from "../../GeneralUI";
import { GeneralContext } from "../../../Main/App";
import CheckIfExists from "../../../../Helpers/CheckIfExists";

export default function NewDirectory() {
  const { setPrompt, setContextMenu } = useContext(UIContext);
  const { state, setDirectoryItems, directoryItems } =
    useContext(GeneralContext);

  async function newDirectory(content) {
    return fetch("/api/manage/newdirectory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: state.currentDirectory + content,
      }),
    })
      .then(async (res) => {
        const response = await res.json();
        if (response.err) {
          console.log(response.err);
        }
        setDirectoryItems((prevItems) => {
          prevItems.push({
            name: content,
            path: state.currentDirectory + content,
            isDirectory: true,
            prefix: content,
            itemtype: "folder",
            permission: true,
          });
          return prevItems;
        });
      })
      .finally(() => {
        setPrompt({});
        setContextMenu({});
      });
  }

  return (
    <button
      className="context-menu-item"
      onClick={() => {
        for (let i = 0; i < 100; i++) {
          const newDirectoryName = `New Folder${i > 1 ? ` (${i})` : ""}`;
          if (!CheckIfExists(directoryItems, newDirectoryName, "name")) {
            setPrompt({
              show: true,
              content: newDirectoryName,
              promptFunction: newDirectory,
            });
            break;
          }
        }
      }}
    >
      New Folder
    </button>
  );
}

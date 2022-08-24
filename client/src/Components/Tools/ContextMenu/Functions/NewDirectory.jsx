import React, { useContext } from "react";
import { UIContext } from "../../GeneralUI";
import { GeneralContext } from "../../../Main/App";
import { foundInArrayWithKey } from "../../../../Helpers/SearchArray";

export default function NewDirectory() {
  const { setPopup, setContextMenu } = useContext(UIContext);
  const { state, setDirectoryItems, directoryItems } =
    useContext(GeneralContext);

  function newDirectory(content) {
    fetch("/api/manage/newdirectory", {
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
          setPopup({
            type: "alert",
            dialog: response.err,
          });
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
        setPopup({});
        setContextMenu({});
      })
      .catch(() => {});
  }

  return (
    <button
      className="context-menu-item"
      onClick={() => {
        for (let i = 0; i < 1000; i++) {
          const newDirectoryName = `New Folder${i > 1 ? ` (${i})` : ""}`;
          if (!foundInArrayWithKey(directoryItems, newDirectoryName, "name")) {
            setPopup({
              type: "prompt",
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

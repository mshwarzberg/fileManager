import React, { useContext } from "react";
import { UIContext } from "../../GeneralUI";
import { GeneralContext } from "../../../Main/App";
import { foundInArrayWithKey } from "../../../../Helpers/SearchArray";
import createNewDirectory from "../FS and OS Functions/CreateNewDirectory";

export default function NewDirectory() {
  const { setPopup, setContextMenu } = useContext(UIContext);
  const { state, setDirectoryItems, directoryItems } =
    useContext(GeneralContext);

  function newDirectory(content) {
    createNewDirectory(state.currentDirectory + content)
      .then(() => {
        setDirectoryItems((prevItems) => {
          prevItems.push({
            name: content,
            path: state.currentDirectory,
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
      .catch((e) => {
        setPopup({
          type: "alert",
          dialog: e,
        });
      });
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

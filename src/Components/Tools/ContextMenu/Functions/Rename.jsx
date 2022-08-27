import React, { useContext } from "react";
import { GeneralContext } from "../../../Main/App";
import { UIContext } from "../../GeneralUI";
import renameItem from "../FS and OS Functions/RenameItem";

export default function Rename({ oldFileName }) {
  const { state, setDirectoryItems } = useContext(GeneralContext);
  const { setContextMenu, setPopup } = useContext(UIContext);

  function renameFunction(newName, oldPath) {
    renameItem(oldPath, state.currentDirectory + newName)
      .then(() => {
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
        setContextMenu({});
        setPopup({});
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
        setPopup({
          type: "prompt",
          content: oldFileName || "",
          promptFunction: renameFunction,
        });
      }}
    >
      Rename
    </button>
  );
}

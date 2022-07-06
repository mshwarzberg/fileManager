import React, { useContext } from "react";
import { DirectoryContext } from "../../../Main/App";

export default function NewDirectory() {
  const { state, setDirectoryItems } = useContext(DirectoryContext);

  return (
    <button
      className="context-menu-item"
      onClick={() => {
        const newFolderName = window.prompt(
          "Enter new folder name:",
          "New Folder"
        );
        if (newFolderName) {
          fetch("/api/manage/newdirectory", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              path: state.currentDirectory + newFolderName,
            }),
          })
            .then(() => {
              setDirectoryItems((prevItems) => [
                ...prevItems,
                {
                  name: newFolderName,
                  path: state.currentDirectory + newFolderName,
                  isDirectory: true,
                  permission: true,
                  prefix: newFolderName,
                  itemtype: "folder",
                },
              ]);
            })
            .catch((e) => {
              console.log(e);
            });
        }
      }}
    >
      New Folder
    </button>
  );
}

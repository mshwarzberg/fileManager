import React, { useContext } from "react";
import { DirectoryContext } from "../Main/App";

export default function ContextMenu({ showContextMenu, setShowContextMenu }) {
  const { directoryItems, state, setDirectoryItems } =
    useContext(DirectoryContext);
  return (
    <div
      id="context-menu"
      style={{
        top: showContextMenu.posY,
        left: showContextMenu.posX,
      }}
    >
      <button
        id="context-menu-item"
        onClick={() => {
          let oldItem = directoryItems[showContextMenu.targetIndex];
          const shouldUpdateThumbnail = [
            oldItem.isDirectory,
            oldItem.oldItemtype === "video",
            oldItem.oldItemtype === "image",
            oldItem.oldItemtype === "gif",
          ];
          if (!oldItem.permission) {
            return;
          }
          const prompt = window.prompt(
            `Enter a new ${oldItem.isDirectory ? "folder" : "file"} name`,
            decodeURI(oldItem.prefix)
          );
          if (prompt && prompt !== oldItem.name) {
            fetch("/api/manage/rename", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                path: oldItem.path,
                oldname: oldItem.name,
                newname:
                  prompt +
                  (oldItem.fileextension !== "Directory"
                    ? "." + oldItem.fileextension
                    : ""),
                drive: state.drive,
                updatethumb: shouldUpdateThumbnail.includes(true),
                oldthumbname:
                  "thumbnail-" +
                  decodeURI(oldItem.prefix) +
                  oldItem.fileextension +
                  ".jpeg",
                newthumbname:
                  "thumbnail-" + prompt + oldItem.fileextension + ".jpeg",
              }),
            })
              .then(async (res) => {
                const response = await res.json();
                if (response.err) {
                  alert(response.err);
                }
                if (!response.err) {
                  setDirectoryItems((prevItems) => {
                    return prevItems.map((item) => {
                      if (item === oldItem) {
                        console.log("test");
                        let path = item.path.slice(
                          0,
                          item.path.length - item.name.length
                        );
                        return {
                          ...item,
                          name: prompt + "." + item.fileextension,
                          path: path + prompt + "." + item.fileextension,
                          prefix: encodeURI(prompt),
                        };
                      }
                      return item;
                    });
                  });
                }
              })
              .catch((e) => {});
          }
          setShowContextMenu({});
        }}
      >
        Rename
      </button>
      <button id="context-menu-item">Cut</button>
      <button id="context-menu-item">Copy</button>
      <button
        id="context-menu-item"
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
                path: directoryItems[showContextMenu.targetIndex].path,
              }),
            });
          }
        }}
      >
        Delete
      </button>
      <button id="context-menu-item">Properties</button>
    </div>
  );
}

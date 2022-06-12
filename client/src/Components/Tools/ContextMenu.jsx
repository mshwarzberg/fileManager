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
            oldItem.itemtype === "video",
            oldItem.itemtype === "image",
            oldItem.itemtype === "gif",
          ];
          if (!oldItem.permission) {
            return;
          }
          const prompt = window.prompt(
            `Enter a new ${oldItem.isDirectory ? "folder" : "file"} name`,
            decodeURI(oldItem.prefix)
          );

          if (prompt && prompt !== oldItem.name) {
            let newName =
              prompt +
              (oldItem.fileextension ? "." + oldItem.fileextension : "");
            fetch("/api/manage/rename", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                path: oldItem.path,
                oldname: oldItem.name,
                newname: newName,
                drive: state.drive,
                renameInThumbDirectory: shouldUpdateThumbnail.includes(true),
                isdirectory: oldItem.isDirectory,
                ...(shouldUpdateThumbnail.includes(true) &&
                  !oldItem.isDirectory && {
                    oldthumbname:
                      "thumbnail-" +
                      decodeURI(oldItem.prefix) +
                      oldItem.fileextension +
                      ".jpeg",
                    newthumbname:
                      "thumbnail-" + prompt + oldItem.fileextension + ".jpeg",
                  }),
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
                        let path = item.path.slice(
                          0,
                          item.path.length - item.name.length
                        );
                        return {
                          ...item,
                          name: newName,
                          path: path + newName,
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
            })
              .then(async (res) => {
                const response = await res.json();
                if (response.err) {
                  alert(response.err);
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
      <button id="context-menu-item">Properties</button>
    </div>
  );
}

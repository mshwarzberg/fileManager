import React, { useContext } from "react";
import { DirectoryContext } from "../../../Main/App";

export default function Rename({ originalItem }) {
  const { state, setDirectoryItems } = useContext(DirectoryContext);
  return (
    <button
      className="context-menu-item"
      onClick={(e) => {
        e.target.parentElement.style.display = "none";
        const shouldUpdateThumbnail = [
          originalItem.isDirectory,
          originalItem.itemtype === "video",
          originalItem.itemtype === "image",
          originalItem.itemtype === "gif",
        ];
        const prompt = window.prompt(
          `Enter a new ${originalItem.isDirectory ? "folder" : "file"} name`,
          decodeURI(originalItem.prefix)
        );

        if (prompt && prompt !== originalItem.name) {
          let newName =
            prompt +
            (originalItem.fileextension
              ? "." + originalItem.fileextension
              : "");
          fetch("/api/manage/rename", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              path: originalItem.path,
              oldname: originalItem.name,
              newname: newName,
              drive: state.drive,
              renameInThumbDirectory: shouldUpdateThumbnail.includes(true),
              isdirectory: originalItem.isDirectory,
              ...(shouldUpdateThumbnail.includes(true) &&
                !originalItem.isDirectory && {
                  oldthumbname:
                    decodeURI(originalItem.prefix) +
                    originalItem.fileextension +
                    ".jpeg",
                  newthumbname: prompt + originalItem.fileextension + ".jpeg",
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
                    if (item === originalItem) {
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
      }}
    >
      Rename
    </button>
  );
}

import React, { useContext } from "react";
import { GeneralContext } from "../../../Main/App";

export default function Rename({ originalItem }) {
  const { state, setDirectoryItems } = useContext(GeneralContext);
  return (
    <button
      className="context-menu-item"
      onClick={(e) => {
        const prompt = window.prompt(
          `Enter a new ${originalItem.isDirectory ? "folder" : "file"} name`,
          originalItem.prefix
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
              isdirectory: originalItem.isDirectory,
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
                    if (item.name === originalItem.name) {
                      let path = item.path.slice(
                        0,
                        item.path.length - item.name.length
                      );
                      return {
                        ...item,
                        name: newName,
                        path: path + newName,
                        prefix: prompt,
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

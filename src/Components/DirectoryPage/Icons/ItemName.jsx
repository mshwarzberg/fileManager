import React, { useContext, useEffect } from "react";
import { DirectoryContext } from "../../Main/App";

export default function ItemName({ directoryItem, disabled, setDisabled }) {
  const { name, path, fileextension, prefix, isDirectory } = directoryItem;
  const { setRename, rename } = useContext(DirectoryContext);

  useEffect(() => {
    if (rename.element === document.getElementById(name + "name")) {
      setDisabled();
    }
  }, [rename]);

  return (
    <div
      spellCheck="false"
      contentEditable="true"
      suppressContentEditableWarning
      className={`block-name ${disabled ? "" : "enabled"}`}
      id={name + "name"}
      onFocus={() => {
        setRename({
          element: document.getElementById(name + "name"),
          endRange: fileextension
            ? name.length - fileextension.length - 1
            : name.length,
          info: {
            ...directoryItem,
            path: path + name + (isDirectory ? "/" : ""),
          },
        });
      }}
      onBlur={() => {
        setDisabled(true);
      }}
      onDoubleClick={(e) => {
        if (!disabled) {
          e.stopPropagation();
        }
      }}
    >
      {name}
    </div>
  );
}

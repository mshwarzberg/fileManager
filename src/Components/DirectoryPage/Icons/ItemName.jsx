import React, { useState } from "react";

const fs = window.require("fs");

export default function ItemName({ directoryItem, renameItem, setRenameItem }) {
  const { name, fileextension, location } = directoryItem;

  const [newName, setNewName] = useState();

  const illegalChars = ['"', "\\", "/", ":", "*", "?", "|", "<", ">"];

  return (
    <div className={`block-name-container`}>
      {name}
      <textarea
        className="block-name"
        disabled={renameItem !== location + name}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Enter") {
            e.target.blur();
          }
        }}
        onFocus={(e) => {
          e.target.setSelectionRange(
            0,
            fileextension ? name.length - fileextension.length - 1 : name.length
          );
        }}
        onMouseEnter={(e) => {
          e.stopPropagation();
        }}
        onMouseMove={(e) => {
          e.stopPropagation();
        }}
        onBlur={(e) => {
          setRenameItem();
          document.getSelection().removeAllRanges();
          if (
            illegalChars
              .map((char) => {
                return e.target.value.includes(char);
              })
              .includes(true) ||
            e.target.value === name
          ) {
            return;
          }
          fs.renameSync(location + name, location + e.target.value);
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
        }}
        value={newName || newName === "" ? newName : name}
        onChange={(e) => {
          setNewName(e.target.value);
        }}
        data-title={""}
      />
    </div>
  );
}

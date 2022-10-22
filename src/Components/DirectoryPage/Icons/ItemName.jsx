import { useState, useContext } from "react";
import { GeneralContext } from "../../Main/App.jsx";

const fs = window.require("fs");

export default function ItemName({ directoryItem, renameItem, setRenameItem }) {
  const { displayName, name, fileextension, location, path } = directoryItem;
  const {
    state: { currentDirectory },
    settings: { appTheme },
  } = useContext(GeneralContext);
  const [newName, setNewName] = useState();

  const illegalChars = ['"', "\\", "/", ":", "*", "?", "|", "<", ">"];

  return (
    <div className="block-name-container">
      {newName || newName === "" ? newName : displayName}
      <textarea
        spellCheck={false}
        className={`block-name text-${appTheme}`}
        disabled={renameItem !== path || currentDirectory === "Trash"}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Enter") {
            e.target.blur();
          }
        }}
        onFocus={(e) => {
          e.target.setSelectionRange(0, name.length - fileextension.length);
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
          try {
            fs.renameSync(path, location + e.target.value);
          } catch {}
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        value={newName || newName === "" ? newName : displayName}
        onChange={(e) => {
          setNewName(e.target.value);
        }}
        data-title={""}
      />
    </div>
  );
}

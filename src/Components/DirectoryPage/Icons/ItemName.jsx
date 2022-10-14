import { useState, useContext } from "react";
import { DirectoryContext } from "../../Main/App";

const fs = window.require("fs");

export default function ItemName({ directoryItem, renameItem, setRenameItem }) {
  const { displayName, name, fileextension, location } = directoryItem;
  const { state } = useContext(DirectoryContext);
  const [newName, setNewName] = useState();

  const illegalChars = ['"', "\\", "/", ":", "*", "?", "|", "<", ">"];

  return (
    <div className="block-name-container">
      {newName || newName === "" ? newName : displayName}
      <textarea
        spellCheck={false}
        className="block-name"
        disabled={
          renameItem !== location + name || state.currentDirectory === "Trash"
        }
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
            fs.renameSync(location + name, location + e.target.value);
            const prevUndo = JSON.parse(localStorage.getItem("undo") || []);
            localStorage.setItem(
              "undo",
              JSON.stringify([
                ...prevUndo,
                {
                  originalName: location + name,
                  currentName: location + e.target.value,
                  change: "rename",
                },
              ])
            );
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

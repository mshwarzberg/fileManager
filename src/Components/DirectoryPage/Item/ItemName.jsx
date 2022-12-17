import { useState, useContext, useEffect } from "react";
import { GeneralContext } from "../../Main/Main.jsx";

const fs = window.require("fs");

export default function ItemName({
  directoryItem,
  renameItem,
  setRenameItem,
  detailsTabWidth,
}) {
  const { displayName, name, fileextension, location, path, isDrive } =
    directoryItem;

  const {
    state: { currentDirectory },
    views: { appTheme, pageView },
  } = useContext(GeneralContext);

  const [newName, setNewName] = useState();

  const illegalChars = ['"', "\\", "/", ":", "*", "?", "|", "<", ">"];

  useEffect(() => {
    if (renameItem.element === document.getElementById(path)) {
      document.getElementById(`name${path}`).focus();
    }
  }, [renameItem]);

  return (
    <div
      className="block-name-container"
      style={{
        maxWidth:
          pageView === "details" ? detailsTabWidth.name - 1 + "rem" : "",
      }}
    >
      {newName || newName === "" ? newName : displayName}
      <textarea
        id={`name${path}`}
        spellCheck={false}
        className={`block-name text-${appTheme}`}
        disabled={
          renameItem.path !== path || currentDirectory === "Trash" || isDrive
        }
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
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
          document.getSelection().removeAllRanges();
          setRenameItem({});
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
          if (!fs.readdirSync(currentDirectory).includes(e.target.value)) {
            try {
              fs.renameSync(path, location + e.target.value);
            } catch {}
          }
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onChange={(e) => {
          setNewName(e.target.value);
        }}
        style={{
          cursor:
            renameItem.element === document.getElementById(path)
              ? "text"
              : "default",
        }}
        value={newName || newName === "" ? newName : displayName}
      />
    </div>
  );
}

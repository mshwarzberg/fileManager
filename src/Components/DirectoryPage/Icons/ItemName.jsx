import { useState, useContext, useEffect } from "react";
import { GeneralContext } from "../../Main/App.jsx";

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
    settings: { appTheme, pageView },
    directoryItems,
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
          if (
            !directoryItems
              .map((directoryItem) => {
                return directoryItem.name;
              })
              .includes(e.target.value)
          ) {
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
        value={newName || newName === "" ? newName : displayName}
        onChange={(e) => {
          setNewName(e.target.value);
        }}
        data-title={""}
      />
    </div>
  );
}

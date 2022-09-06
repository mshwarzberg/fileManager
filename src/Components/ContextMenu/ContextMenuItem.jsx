import React, { useContext, useEffect } from "react";
import { DirectoryContext } from "../Main/App";
import { UIContext } from "../UI and UX/UIandUX";
import newDirectory from "../../Helpers/FS and OS/NewDirectory";

const { exec, execFileSync } = window.require("child_process");

export default function ContextMenuItem({
  contextName,
  clearContextMenu,
  contextMenu,
}) {
  useEffect(() => {
    document.addEventListener("click", clearContextMenu);
    window.addEventListener("blur", clearContextMenu);
    return () => {
      window.removeEventListener("blur", clearContextMenu);
      document.removeEventListener("click", clearContextMenu);
    };
  }, []);

  const { itemsSelected, setRename, state } = useContext(DirectoryContext);
  const { setClipboardData, clipboardData } = useContext(UIContext);

  const { isFile, path, name, fileextension } = contextMenu.info;

  return (
    <button
      className="context-menu-button"
      onClick={() => {
        switch (contextName) {
          case "Open":
            exec(`"${path}"`);
            break;
          case "Show In Explorer":
            let CMDpath = path.replaceAll("/", "\\");
            exec(`explorer.exe ${isFile ? `/select, ${CMDpath}` : CMDpath}`);
            break;
          case "Cut":
          case "Copy":
            setClipboardData({
              mode: contextName.toLowerCase(),
              info: itemsSelected.map((itemSelected) => itemSelected.info),
            });
            break;
          case "Rename":
            if (!contextMenu.info.isPartOfTree) {
              setRename({
                element: document.getElementById(name + "name"),
                endRange: fileextension
                  ? name.length - fileextension.length - 1
                  : name.length,
                info: contextMenu.info,
              });
            } else {
              setRename({
                element: document.getElementById(path + "tree"),
                endRange: name.length,
                info: contextMenu.info,
                isPartOfTree: true,
              });
            }
            break;
          case "Delete":
            try {
              execFileSync("recycle.exe", [
                ...itemsSelected
                  .map((itemSelected) => itemSelected.info.path)
                  .filter((item) => item && item),
              ]);
            } catch (e) {
              console.log(e);
            }
            break;
          case "New Folder":
            newDirectory(state);
            break;
          default:
            return;
        }
      }}
    >
      {contextName}
    </button>
  );
}

import React, { useContext, useEffect } from "react";
import { DirectoryContext } from "../Main/App";
import { UIContext } from "../UI and UX/UIandUX";
import newDirectory from "../../Helpers/FS and OS/NewDirectory";
import checkDestinationDuplicates from "../../Helpers/FS and OS/CheckDestinationDuplicates";

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

  const { itemsSelected, state, setRenameItem } = useContext(DirectoryContext);
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
          case "Paste":
            if (typeof clipboardData.info === "object") {
              if (clipboardData.info[0].location === contextMenu.destination) {
                return;
              }
              console.log(
                checkDestinationDuplicates(
                  clipboardData.info
                    .map((item) => item.name)
                    .filter((item) => item && item),
                  contextMenu.destination
                )
              );
            }
            break;
          case "Rename":
            setRenameItem(path);
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
          case "Refresh":
            window.location.reload(true);
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

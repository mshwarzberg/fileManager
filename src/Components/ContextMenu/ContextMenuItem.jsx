import { useContext, useEffect, useState } from "react";
import { GeneralContext } from "../Main/Main.jsx";
import { UIContext } from "../Main/UIandUX";
import newDirectory from "../../Helpers/FS and OS/NewDirectory";
import Sort from "./Sort";
import View from "./View";
import Archive from "./Archive.jsx";
import clickOnItem from "../../Helpers/ClickOnItem";
import { handleTransfer } from "../../Helpers/FS and OS/HandleTransfer";
import formatSize from "../../Helpers/FormatSize.js";
import formatDate from "../../Helpers/FormatDate.js";

const { exec } = window.require("child_process");

export default function ContextMenuItem({
  contextName,
  clearContextMenu,
  contextMenu,
  setReload,
  contextMenu: {
    info,
    info: { isFile, path },
    element,
  },
  selectedItems,
}) {
  useEffect(() => {
    document.addEventListener("click", clearContextMenu);
    window.addEventListener("blur", clearContextMenu);
    return () => {
      window.removeEventListener("blur", clearContextMenu);
      document.removeEventListener("click", clearContextMenu);
    };
  }, []);

  const {
    state: { currentDirectory },
    setRenameItem,
    dispatch,
    settings: { appTheme },
  } = useContext(GeneralContext);
  const { setClipboard, clipboard, setPopup } = useContext(UIContext);

  const [showSort, setShowSort] = useState();
  const [showView, setShowView] = useState();
  const [showArchive, setShowArchive] = useState();

  if (currentDirectory === "Trash") {
    if (contextName === "Delete") {
      contextName = "Delete Permanently";
    }
    if (contextName === "Rename") {
      contextName = "Restore";
    }
    if (contextName === "Open") {
      contextName = "Empty Trash";
    }
    if (contextName === "Archive") {
      return <></>;
    }
  }

  function subMenuClassNames() {
    let className = "sort-by-sub-menu";
    if (contextMenu.x + 320 > window.innerWidth) {
      className += " position-left";
    }
    if (contextMenu.y + 238 > window.innerHeight) {
      className += " position-top";
    }
    return className;
  }

  return (
    <div
      className={`button-${appTheme}`}
      onMouseEnter={() => {
        if (contextName === "Sort By") {
          setTimeout(() => {
            setShowSort(true);
          }, 0);
        } else if (contextName === "View") {
          setTimeout(() => {
            setShowView(true);
          }, 0);
        } else if (contextName === "Archive") {
          setTimeout(() => {
            setShowArchive(true);
          }, 0);
        }
      }}
      onMouseLeave={(e) => {
        if (contextName === "Sort By") {
          setShowSort();
        } else if (contextName === "View") {
          setShowView();
        } else if (contextName === "Archive") {
          setShowArchive();
        }
      }}
      onMouseUp={() => {
        switch (contextName) {
          case "Open":
            clickOnItem(info, dispatch);
            break;
          case "Show In Explorer":
            let CMDpath = path.replaceAll("/", "\\");
            if (CMDpath === "Trash") {
              exec(`start shell:RecycleBinFolder`);
            } else {
              exec(
                `explorer.exe ${
                  isFile ? `/select, "${CMDpath}"` : `"${CMDpath}"`
                }`
              );
            }
            break;
          case "Cut":
          case "Copy":
            setClipboard({
              source: currentDirectory,
              mode: contextName === "Cut" ? "move" : "copy",
              info: Object.keys(contextMenu.info).includes("collapsed")
                ? [contextMenu.info]
                : selectedItems.map((path) => {
                    const element = document.getElementById(path);
                    const info = JSON.parse(element.dataset.info || "{}");
                    return info;
                  }),
            });
            break;
          case "Paste":
            handleTransfer(
              contextMenu.destination,
              setPopup,
              clipboard,
              setClipboard
            );
            break;
          case "Rename":
            setRenameItem({ path: path, element: element });
            break;
          case "Delete":
            for (const file of selectedItems) {
              exec(`call ./resources/MoveToTrash.bat "${file}"`, (e, d) => {});
            }
            break;
          case "New Folder":
            newDirectory(currentDirectory);
            break;
          case "Refresh":
            setReload((prevReload) => !prevReload);
            break;
          case "Properties":
            setPopup({
              body: (
                <div id="properties-body">
                  <p className={`text-${appTheme}`}>
                    Size: {formatSize(info.size)}
                  </p>
                  <p className={`text-${appTheme}`}>
                    Last Modified: {formatDate(new Date(info.modified))}
                  </p>
                </div>
              ),
            });
            break;
          case "Restore":
            for (const currentPath of selectedItems) {
              const originalPath = JSON.parse(
                document.getElementById(currentPath).dataset.info || "{}"
              ).displayPath;
              exec(
                `powershell.exe ./resources/PS1Scripts/Transfer.ps1 '${currentPath}' '${originalPath}' move`
              );
            }
            break;
          case "Delete Permanently":
            break;
          case "Empty Trash":
            break;
          default:
            return;
        }
      }}
    >
      {contextName}
      {(contextName === "Sort By" ||
        contextName === "View" ||
        contextName === "Archive") && <p className="sub-menu-arrow">→</p>}

      {showSort && <Sort subMenuClassNames={subMenuClassNames} />}
      {showView && (
        <View contextMenu={contextMenu} subMenuClassNames={subMenuClassNames} />
      )}
      {showArchive && (
        <Archive
          selectedItems={selectedItems}
          contextMenu={contextMenu}
          subMenuClassNames={subMenuClassNames}
        />
      )}
    </div>
  );
}

import { useContext, useEffect, useState } from "react";
import { GeneralContext } from "../Main/Main.jsx";
import { UIContext } from "../Main/UIandUX";
import newDirectory from "../../Helpers/FS and OS/NewDirectory";
import Sort from "./Sort";
import View from "./View";
import clickOnItem from "../../Helpers/ClickOnItem";
import { handleTransfer } from "../../Helpers/FS and OS/HandleTransfer";
import formatSize from "../../Helpers/FormatSize.js";
import formatDate from "../../Helpers/FormatDate.js";

const { exec, execSync } = window.require("child_process");

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
    state,
    setRenameItem,
    dispatch,
    setDirectoryItems,
    settings: { appTheme },
  } = useContext(GeneralContext);
  const { setClipboard, clipboard, setPopup } = useContext(UIContext);

  const [showSort, setShowSort] = useState();
  const [showView, setShowView] = useState();

  if (state.currentDirectory === "Trash") {
    if (contextName === "Delete") {
      contextName = "Delete Permanently";
    }
    if (contextName === "Rename") {
      contextName = "Restore";
    }
    if (contextName === "Open") {
      contextName = "Empty Trash";
    }
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
        }
      }}
      onMouseLeave={(e) => {
        if (contextName === "Sort By") {
          setShowSort();
        } else if (contextName === "View") {
          setShowView();
        }
      }}
      onClick={() => {
        switch (contextName) {
          case "Open":
            clickOnItem(info, dispatch);
            break;
          case "Show In Explorer":
            let CMDpath = path.replaceAll("/", "\\");
            exec(
              `explorer.exe ${
                isFile ? `/select, "${CMDpath}"` : `"${CMDpath}"`
              }`,
              (e, d) => {
                console.log(e, d);
              }
            );
            break;
          case "Cut":
          case "Copy":
            setClipboard({
              source: state.currentDirectory,
              mode: contextName === "Cut" ? "move" : "copy",
              info: selectedItems.map((path) => {
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
            exec(`call ./Misc/del.bat "${contextMenu.info.path}"`, () => {});
            break;
          case "New Folder":
            newDirectory(state);
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
      {(contextName === "Sort By" || contextName === "View") && (
        <p className="sub-menu-arrow">→</p>
      )}
      {showSort && <Sort contextMenu={contextMenu} />}
      {showView && <View contextMenu={contextMenu} />}
    </div>
  );
}

import { useContext, useEffect, useState } from "react";
import { DirectoryContext } from "../Main/App.jsx";
import { UIContext } from "../Main/UIandUX";
import newDirectory from "../../Helpers/FS and OS/NewDirectory";
import Sort from "./Sort";
import View from "./View";
import clickOnItem from "../../Helpers/ClickOnItem";
import randomID from "../../Helpers/RandomID";
import {
  handleMoveToTrash,
  restoreFromTrash,
} from "../../Helpers/FS and OS/HandleTrash";
import { handleTransfer } from "../../Helpers/FS and OS/HandleTransfer";
const { exec } = window.require("child_process");

export default function ContextMenuItem({
  contextName,
  clearContextMenu,
  contextMenu,
  contextMenu: {
    info,
    info: { isFile, path },
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

  const { state, setRenameItem, dispatch, setDirectoryItems } =
    useContext(DirectoryContext);
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
      className="context-menu-button"
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
            exec(`explorer.exe ${isFile ? `/select, ${CMDpath}` : CMDpath}`);
            break;
          case "Cut":
          case "Copy":
            setClipboard({
              source: state.currentDirectory,
              mode: contextName.toLowerCase(),
              info: selectedItems.map((itemSelected) => itemSelected.info),
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
            setRenameItem(path);
            break;
          case "Delete":
            try {
              const id = "$" + randomID(10);
              handleMoveToTrash(
                selectedItems[0]
                  ? selectedItems.map((item) => {
                      const { info } = item;
                      return {
                        ...info,
                        name: id + info.fileextension,
                        location: state.drive + "trash/",
                        path: state.drive + "trash/" + id + info.fileextension,
                        current:
                          state.drive + "trash/" + id + info.fileextension,
                        original: info.path,
                        ...(info.size < 300000 && {
                          thumbPath:
                            state.drive + "trash/" + id + info.fileextension,
                        }),
                      };
                    })
                  : [
                      {
                        ...info,
                        name: id + info.fileextension,
                        location: state.drive + "trash/",
                        path: state.drive + "trash/" + id + info.fileextension,
                        current:
                          state.drive + "trash/" + id + info.fileextension,
                        original: info.path,
                        ...(info.size < 300000 && {
                          thumbPath:
                            state.drive + "trash/" + id + info.fileextension,
                        }),
                      },
                    ],
                state.drive
              );
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
          case "Restore":
            setDirectoryItems(
              restoreFromTrash(
                selectedItems.map((selectedItem) => selectedItem.info)
              )
            );
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

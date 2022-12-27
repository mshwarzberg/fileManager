import { useContext, useEffect } from "react";
import { GeneralContext } from "../Main/Main.jsx";
import {
  addToDirectoryTree,
  handleDirectoryTree,
} from "../../Helpers/ChangeItemInTree";
import contextMenuOptions from "../../Helpers/ContextMenuOptions";
import getChildDirectoriesTree from "../../Helpers/FS and OS/GetChildDirectoriesTree";

const fs = window.require("fs");

export default function ChildDirectory({ childDir, containsDirectories }) {
  const {
    directoryState: { directoryTree, currentDirectory },
    dispatch,
    views: { treeCompactView, appTheme },
  } = useContext(GeneralContext);
  const { path, name, permission, linkTo } = childDir;

  useEffect(() => {
    try {
      if (name === "Trash") {
        return;
      }
      fs.readdirSync(path);
    } catch {
      handleDirectoryTree(directoryTree, path);
    }
  }, []);

  const isDirectoryCurrent = currentDirectory === path;

  function clickDirectory(toOpenDirectory, toExpandTree) {
    if (toOpenDirectory) {
      dispatch({
        type: "open",
        value: linkTo || path,
      });
      if (!toExpandTree) {
        return;
      }
    }
    dispatch({
      type: "updateDirectoryTree",
      value: addToDirectoryTree(
        directoryTree,
        path,
        getChildDirectoriesTree(path)
      ),
    });
  }

  return (
    <button
      className={(() => {
        let className = "child-directory";
        if (!permission) {
          className += " no-permission";
        }
        if (treeCompactView) {
          className += " compact-tree";
        }
        className += ` child-directory-${appTheme}`;
        return className;
      })()}
      id={isDirectoryCurrent ? `current-directory-${appTheme}` : ""}
      onClick={(e) => {
        e.stopPropagation();
        if (!permission) {
          return;
        }
        clickDirectory(true);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        if (!permission || !containsDirectories) {
          return;
        }
        clickDirectory(true, true, true);
      }}
      data-contextmenu={contextMenuOptions(childDir)}
      data-info={permission && JSON.stringify(childDir)}
      data-destination={path}
    >
      {containsDirectories && (
        <div
          className="expand-directory"
          onClick={(e) => {
            if (!permission) {
              return;
            }
            clickDirectory(false, true);
            e.stopPropagation();
          }}
          data-destination={path}
        >
          →
        </div>
      )}
      <div className={`directory-name text-${appTheme}`}>{name}</div>
    </button>
  );
}

import { useContext, useEffect } from "react";
import { GeneralContext } from "../Main/App.jsx";
import {
  addToDirectoryTree,
  handleDirectoryTree,
} from "../../Helpers/ChangeItemInTree";
import contextMenuOptions from "../../Helpers/ContextMenuOptions";
import formatTitle from "../../Helpers/FormatTitle";
import getChildDirectoriesTree from "../../Helpers/FS and OS/GetChildDirectoriesTree";

const fs = window.require("fs");

export default function ChildDirectory({ childDir, containsDirectories }) {
  const {
    state,
    dispatch,
    settings: { treeCompactView, appTheme },
  } = useContext(GeneralContext);
  const { path, name, permission, linkTo } = childDir;

  useEffect(() => {
    try {
      if (name === "Trash") {
        return;
      }
      fs.readdirSync(path);
    } catch {
      handleDirectoryTree(state.directoryTree, path);
    }
  }, []);

  const isDirectoryCurrent = state.currentDirectory === path;

  let isPathClickedAlready;
  function clickDirectory(toOpenDirectory, toExpandTree, dblClick) {
    if (isPathClickedAlready && !dblClick) {
      return;
    }
    isPathClickedAlready = path;
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
        state.directoryTree,
        path,
        getChildDirectoriesTree(path)
      ),
    });
  }

  return (
    <button
      className={`child-directory ${!permission && "no-permission"} ${
        treeCompactView ? "compact-tree" : ""
      }`}
      id={isDirectoryCurrent ? "current-directory" : ""}
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
      data-title={formatTitle(childDir)}
      data-destination={JSON.stringify({
        destination: path,
      })}
    >
      {containsDirectories && (
        <div
          className="arrow-container"
          onClick={(e) => {
            if (!permission) {
              return;
            }
            clickDirectory(false, true);
            e.stopPropagation();
          }}
        >
          <img className="directory-tree-arrow" alt=">" />
        </div>
      )}
      <div className={`directory-name text-${appTheme}`}>{name}</div>
    </button>
  );
}

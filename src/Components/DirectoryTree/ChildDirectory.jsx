import React, { useContext, useEffect } from "react";
import { DirectoryContext } from "../Main/App";
import {
  addToDirectoryTree,
  handleDirectoryTree,
} from "../../Helpers/ChangeItemInTree";
import contextMenuOptions from "../../Helpers/ContextMenuOptions";
import formatTitle from "../../Helpers/FormatTitle";
import getChildDirectoriesTree from "../../Helpers/FS and OS/GetChildDirectoriesTree";
import useCaretColor, { handleMouse } from "./useCaretColor";

const fs = window.require("fs");

export default function ChildDirectory({ childDir, containsDirectories }) {
  const { state, dispatch } = useContext(DirectoryContext);
  const { path, name, permission, isDirectory, isDrive, linkTo } = childDir;

  useEffect(() => {
    try {
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
    if (!path.startsWith(state.drive) || !state.drive) {
      dispatch({ type: "drive", value: path.slice(0, 3) });
    }
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

  const { caretColor, setCaretColor } = useCaretColor(isDirectoryCurrent);

  return (
    <button
      className={`child-directory ${!permission && "no-permission"}`}
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
      onMouseEnter={(e) => {
        handleMouse(e, setCaretColor, isDirectoryCurrent);
      }}
      onMouseLeave={(e) => {
        handleMouse(e, setCaretColor, isDirectoryCurrent);
      }}
      data-contextmenu={contextMenuOptions(childDir)}
      data-info={permission && JSON.stringify(childDir)}
      data-title={formatTitle(childDir)}
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
          onMouseEnter={(e) => {
            handleMouse(e, setCaretColor, isDirectoryCurrent);
          }}
          onMouseLeave={(e) => {
            handleMouse(e, setCaretColor, isDirectoryCurrent);
          }}
        >
          <img className="directory-tree-arrow" src={caretColor} alt=">" />
        </div>
      )}
      <div className="directory-name">{name}</div>
    </button>
  );
}

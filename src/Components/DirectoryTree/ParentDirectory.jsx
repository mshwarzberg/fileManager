import React, { useContext, useEffect, useRef } from "react";
import { DirectoryContext } from "../Main/App";
import { updateDirectoryTree } from "../../Helpers/ChangeItemInTree";
import contextMenuOptions from "../../Helpers/ContextMenuOptions";

import formatTitle from "../../Helpers/FormatTitle";
import { handleDirectoryTree } from "../../Helpers/ChangeItemInTree";
import { getTreeItem } from "../../Helpers/FS and OS/GetChildDirectoriesTree";

import useCaretColor, { handleMouse } from "./useCaretColor";

const fs = window.require("fs");

export default function ParentDirectory({
  parentDir,
  children,
  childDirsList,
}) {
  const { path, name, permission, collapsed, isDirectory, isDrive } = parentDir;
  const { state, dispatch } = useContext(DirectoryContext);

  const isDirectoryCurrent = state.currentDirectory === path;

  const arrow = useRef();

  useEffect(() => {
    try {
      const items = fs.readdirSync(path, { withFileTypes: true });
      for (const item of items) {
        if (item.isDirectory()) {
          const newTreeItem = getTreeItem(path, item);
          const childDirNames = childDirsList.map((child) => {
            return child.path || child[0]?.path;
          });
          if (!childDirNames.includes(path + item.name + "/") && newTreeItem) {
            handleDirectoryTree(state.directoryTree, path, [
              ...childDirsList,
              newTreeItem,
            ]);
          }
        }
      }
    } catch {
      handleDirectoryTree(state.directoryTree, path);
    }
  }, []);

  function handleCollapseAndExpanse(e) {
    e.stopPropagation();
    if (!name) {
      return;
    }
    if (collapsed) {
      return dispatch({
        type: "updateDirectoryTree",
        value: updateDirectoryTree(state.directoryTree, path, {
          collapsed: false,
        }),
      });
    }
    dispatch({
      type: "updateDirectoryTree",
      value: updateDirectoryTree(state.directoryTree, path, {
        collapsed: true,
      }),
    });
  }

  const { caretColor, setCaretColor } = useCaretColor();

  return (
    <div className="child-directories-container">
      {name && <div className="line-down" onClick={handleCollapseAndExpanse} />}
      <button
        className={
          collapsed ? "parent-directory-collapsed" : "parent-directory"
        }
        id={isDirectoryCurrent ? "current-directory" : ""}
        onDoubleClick={() => {
          dispatch({
            type: "updateDirectoryTree",
            value: updateDirectoryTree(state.directoryTree, path, {
              collapsed: !collapsed,
            }),
          });
        }}
        onClick={(e) => {
          e.stopPropagation();
          dispatch({ type: "open", value: path || "" });
          if (!path?.startsWith(state.drive)) {
            dispatch({ type: "drive", value: path?.slice(0, 3) });
          }
        }}
        onMouseEnter={(e) => {
          handleMouse(e, setCaretColor, isDirectoryCurrent);
        }}
        onMouseLeave={(e) => {
          handleMouse(e, setCaretColor, isDirectoryCurrent);
        }}
        data-contextmenu={contextMenuOptions(parentDir)}
        data-info={permission && JSON.stringify(parentDir)}
        data-title={formatTitle(parentDir)}
      >
        {name && (
          <div
            className="arrow-container"
            onClick={handleCollapseAndExpanse}
            onMouseEnter={(e) => {
              handleMouse(e, setCaretColor, isDirectoryCurrent);
            }}
            onMouseLeave={(e) => {
              handleMouse(e, setCaretColor, isDirectoryCurrent);
            }}
          >
            <img
              ref={arrow}
              className={`directory-tree-arrow ${collapsed ? "rotate-me" : ""}`}
              src={caretColor}
              alt=">"
            />
          </div>
        )}
        <div disabled={true} className="directory-name">
          {name || "This PC"}
        </div>
      </button>
      <div className={`child-directories-list ${collapsed ? "collapsed" : ""}`}>
        {children}
      </div>
    </div>
  );
}

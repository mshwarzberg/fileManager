import { useContext, useEffect } from "react";
import { GeneralContext } from "../Main/App.jsx";
import { updateDirectoryTree } from "../../Helpers/ChangeItemInTree";
import contextMenuOptions from "../../Helpers/ContextMenuOptions";

import formatTitle from "../../Helpers/FormatTitle";
import { handleDirectoryTree } from "../../Helpers/ChangeItemInTree";
import { getTreeItem } from "../../Helpers/FS and OS/GetChildDirectoriesTree";

const fs = window.require("fs");

export default function ParentDirectory({
  parentDir,
  children,
  childDirsList,
}) {
  const { path, name, permission, collapsed } = parentDir;
  const {
    state,
    dispatch,
    settings: { treeCompactView, appTheme },
  } = useContext(GeneralContext);

  const isDirectoryCurrent = state.currentDirectory === path;

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

  return (
    <div className="child-directories-container">
      {name && (
        <div
          className={`line-down line-${appTheme}`}
          onClick={handleCollapseAndExpanse}
        />
      )}
      <button
        className={(() => {
          let className = "";
          if (collapsed) {
            className = "parent-directory-collapsed";
          } else {
            className = "parent-directory";
          }
          if (treeCompactView) {
            className += " compact-tree";
          }
          className += ` parent-directory-${appTheme}`;
          return className;
        })()}
        id={isDirectoryCurrent ? `current-directory-${appTheme}` : ""}
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
        }}
        data-contextmenu={contextMenuOptions(parentDir)}
        data-info={permission && JSON.stringify(parentDir)}
        data-title={formatTitle(parentDir)}
        data-destination={path}
      >
        {name && (
          <div
            className={`expand-directory ${collapsed ? "" : "rotate-arrow"}`}
            onClick={handleCollapseAndExpanse}
            data-destination={path}
          >
            →
          </div>
        )}
        <div className={`directory-name text-${appTheme}`}>
          {name || "This PC"}
        </div>
      </button>
      <div className={`child-directories-list ${collapsed ? "collapsed" : ""}`}>
        {children}
      </div>
    </div>
  );
}

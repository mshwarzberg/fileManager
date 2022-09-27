import React, { useContext } from "react";
import { DirectoryContext } from "../Main/App";
import { updateDirectoryTree } from "../../Helpers/ChangeItemInTree";
import contextMenuOptions from "../../Helpers/ContextMenuOptions";
import rightCaretImage from "../../Images/right-caret.png";
import formatTitle from "../../Helpers/FormatTitle";

export default function ParentDirectory({ parentDir, children }) {
  const { path, name, permission, collapsed, isDirectory, isDrive } = parentDir;
  const { state, dispatch } = useContext(DirectoryContext);

  const disabled = true;

  return (
    <div className="child-directories-container">
      <button
        className={
          collapsed ? "parent-directory-collapsed" : "parent-directory"
        }
        style={{
          ...(path === state.currentDirectory && {
            backgroundColor: "#999",
            color: "#000",
            fontWeight: "bold",
          }),
        }}
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
        data-contextmenu={contextMenuOptions(parentDir)}
        data-info={permission && JSON.stringify(parentDir)}
        data-title={formatTitle(parentDir)}
      >
        <div className="arrow-container">
          <img
            onClick={(e) => {
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
            }}
            className={`directory-tree-arrow ${collapsed ? "rotate-me" : ""}`}
            src={rightCaretImage}
            alt=">"
          />
        </div>
        <div
          spellCheck="false"
          contentEditable="true"
          suppressContentEditableWarning
          disabled={true}
          className={`directory-name ${disabled ? "" : "enabled"}`}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
          }}
        >
          {name || "This PC"}
        </div>
      </button>
      <div className={`child-directories-list ${collapsed ? "collapsed" : ""}`}>
        {children}
      </div>
    </div>
  );
}

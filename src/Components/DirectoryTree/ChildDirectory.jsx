import React, { useContext } from "react";
import { DirectoryContext } from "../Main/App";
import { addToDirectoryTree } from "../../Helpers/ChangeItemInTree";
import checkFileType from "../../Helpers/FS and OS/CheckFileType";
import contextMenuOptions from "../../Helpers/ContextMenuOptions";
import rightCaretImage from "../../Images/right-caret.png";
import formatTitle from "../../Helpers/FormatTitle";

const fs = window.require("fs");

export default function ChildDirectory({ childDir, containsDirectories }) {
  const { state, dispatch, rename } = useContext(DirectoryContext);
  const { path, name, permission, isDirectory, isDrive, linkTo } = childDir;

  const disabled = rename.element !== document.getElementById(path + "tree");

  let isPathClickedAlready;
  function clickDirectory(toOpenDirectory, toExpandTree, dblClick) {
    if (isPathClickedAlready && !dblClick) {
      return;
    }
    isPathClickedAlready = path;
    if (!path.startsWith(state.drive) || !state.drive || isDrive) {
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

    fs.readdir(path, { withFileTypes: true }, (error, files) => {
      if (error) return console.log(error);
      let dirArray = [];
      for (const item of files) {
        if (
          (item.name === "temp" ||
            item.name === "$RECYCLE.BIN" ||
            item.name === "System Volume Information") &&
          path.length === 3
        ) {
          continue;
        }
        let permission = true;
        try {
          fs.statSync(`${path}/${item.name}`);
        } catch {
          permission = false;
        }
        let symLink;
        if (item.isSymbolicLink()) {
          symLink = fs.readlinkSync(path + "/" + item.name);
          symLink = symLink.replaceAll("\\", "/");
        }

        if (item.isDirectory() || item.isSymbolicLink()) {
          dirArray.push({
            path: path + item.name + (item.isDirectory() ? "/" : ""),
            name: item.name,
            permission: permission,
            isDirectory: item.isDirectory(),
            collapsed: true,
            isPartOfTree: true,
            ...(item.isSymbolicLink() && {
              linkTo: symLink,
              isSymbolicLink: true,
            }),
          });
        }
      }
      dispatch({
        type: "updateDirectoryTree",
        value: addToDirectoryTree(state.directoryTree, path, dirArray),
      });
    });
  }

  return (
    <div
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
      style={{
        ...(path === state.currentDirectory && {
          backgroundColor: "#999",
          color: "#000",
          fontWeight: "bold",
        }),
      }}
      className={`child-directory ${!permission && "no-permission"}`}
      data-contextmenu={contextMenuOptions(childDir)}
      data-info={permission && JSON.stringify(childDir)}
      data-title={formatTitle(childDir)}
    >
      {containsDirectories && (
        <div className="arrow-container">
          <img
            onClick={(e) => {
              if (!permission) {
                return;
              }
              clickDirectory(false, true);
              e.stopPropagation();
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            className="directory-tree-arrow"
            src={rightCaretImage}
            alt=">"
          />
        </div>
      )}
      <div
        spellCheck="false"
        contentEditable="true"
        suppressContentEditableWarning
        disabled={true}
        className={`directory-name ${disabled ? "" : "enabled"}`}
        id={path + "tree"}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
        }}
      >
        {name}
      </div>
    </div>
  );
}

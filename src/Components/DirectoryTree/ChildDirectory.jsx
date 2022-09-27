import React, { useContext } from "react";
import { DirectoryContext } from "../Main/App";
import { addToDirectoryTree } from "../../Helpers/ChangeItemInTree";
import checkFileType from "../../Helpers/FS and OS/CheckFileType";
import contextMenuOptions from "../../Helpers/ContextMenuOptions";
import rightCaretImage from "../../Images/right-caret.png";
import formatTitle from "../../Helpers/FormatTitle";
import getChildDirectoriesTree from "../../Helpers/FS and OS/GetChildDirectoriesTree";
import { useEffect } from "react";

const fs = window.require("fs");
const watch = window.require("node-watch");

export default function ChildDirectory({ childDir, containsDirectories }) {
  const { state, dispatch } = useContext(DirectoryContext);
  const { path, name, permission, isDirectory, isDrive, linkTo } = childDir;

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
    dispatch({
      type: "updateDirectoryTree",
      value: addToDirectoryTree(
        state.directoryTree,
        path,
        getChildDirectoriesTree(path).map((childDirectory) => ({
          ...childDirectory,
          path: childDirectory.location,
        }))
      ),
    });
  }
  // useEffect(() => {
  //   try {
  //     fs.watchFile(path, (curr, prev) => {
  //       // console.log(curr, prev, path);
  //     });
  //   } catch {}
  //   return () => {
  //     fs.unwatchFile(path);
  //   };
  // }, []);
  return (
    <button
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
        className="directory-name"
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
    </button>
  );
}

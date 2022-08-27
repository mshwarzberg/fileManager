import React, { useContext } from "react";
import { GeneralContext } from "../../Main/App";
import { addToDirectoryTree } from "../../../Helpers/ChangeItemInTree";

import blackArrow from "../../../Assets/images/directorytree/right-arrow-black.png";
import whiteArrow from "../../../Assets/images/directorytree/right-arrow-white.png";

import directory from "../../../Assets/images/folder.png";
import driveIcon from "../../../Assets/images/drive.png";
import notAllowedIcon from "../../../Assets/images/notallowed.png";

import getDirectoryTree from "../FS and OS/GetDirectoryTree";

export default function ChildDir({ child, altImage }) {
  const { state, dispatch } = useContext(GeneralContext);
  const { path, name, permission, isDirectory, isDrive, linkTo } = child;

  let isPathClickedAlready;
  function clickDirectory(toOpenDirectory, toExpandTree) {
    if (isPathClickedAlready) {
      return;
    }
    isPathClickedAlready = path;
    if (!path.startsWith(state.drive) || !state.drive || isDrive) {
      dispatch({ type: "setDriveName", value: path.slice(0, 3) });
    }
    if (toOpenDirectory) {
      dispatch({
        type: "openDirectory",
        value: linkTo || path,
      });
      if (!toExpandTree) {
        return;
      }
    }
    getDirectoryTree(linkTo || path).then((result) => {
      dispatch({
        type: "updateDirectoryTree",
        value: addToDirectoryTree(state.directoryTree, path, result),
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
        if (!permission) {
          return;
        }
        clickDirectory(true, true);
      }}
      className={`tree--closed-directory ${!permission && "no-permission"}`}
      id={path === state.currentDirectory ? "highlight--child" : ""}
      data-info={
        permission && (isDrive || isDirectory) ? JSON.stringify(child) : null
      }
      data-destination={
        isDirectory || isDrive ? JSON.stringify({ destination: path }) : null
      }
    >
      <img
        onClick={(e) => {
          if (!permission) {
            return;
          }
          clickDirectory(false);
          e.stopPropagation();
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        className="tree--arrow"
        src={
          permission
            ? path === state.currentDirectory
              ? blackArrow
              : whiteArrow
            : notAllowedIcon
        }
        alt="expand directory"
      />
      <img
        src={altImage(name) || (!isDrive ? directory : driveIcon)}
        alt="icon"
        className="side--icon"
        style={{ pointerEvents: "none" }}
      />
      {name}
    </div>
  );
}

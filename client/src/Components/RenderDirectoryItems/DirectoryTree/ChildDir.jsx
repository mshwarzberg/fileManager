import React, { useContext } from "react";
import { GeneralContext } from "../../Main/App";
import { addToDirectoryTree } from "../../../Helpers/ChangeItemInTree";

import blackArrow from "../../../Assets/images/directorytree/right-arrow-black.png";
import whiteArrow from "../../../Assets/images/directorytree/right-arrow-white.png";

import directory from "../../../Assets/images/folder.png";
import driveIcon from "../../../Assets/images/drive.png";
import notAllowedIcon from "../../../Assets/images/notallowed.png";

export default function ChildDir({ child, altImage }) {
  const { state, dispatch } = useContext(GeneralContext);
  const { path, name, permission, isDirectory, isDrive, linkTo } = child;

  function clickDirectory(toOpenDirectory, toExpandTree) {
    if (!path.startsWith(state.drive) || !state.drive || isDrive) {
      let drive = isDrive ? name : path.slice(0, 2);
      dispatch({ type: "setDriveName", value: drive + "/" });
    }
    if (toOpenDirectory) {
      dispatch({
        type: "openDirectory",
        value: (linkTo || path) + "/",
      });
      if (!toExpandTree) {
        return;
      }
    }
    fetch("/api/directorytree", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: linkTo || path }),
    })
      .then(async (res) => {
        const response = await res.json();
        dispatch({
          type: "updateDirectoryTree",
          value: addToDirectoryTree(state.directoryTree, path, response),
        });
      })
      .catch(() => {});
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
      id={path + "/" === state.currentDirectory ? "highlight--child" : ""}
      data-info={
        permission && (isDrive || isDirectory) ? JSON.stringify(child) : null
      }
    >
      <img
        onClick={(e) => {
          clickDirectory(false);
          if (!permission) {
            return;
          }
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        className="tree--arrow"
        src={
          permission
            ? path + "/" === state.currentDirectory
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
      />
      {name}
    </div>
  );
}

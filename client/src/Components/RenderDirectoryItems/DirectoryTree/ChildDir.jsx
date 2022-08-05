import React, { useContext } from "react";
import { GeneralContext } from "../../Main/App";
import { addToDirectoryTree } from "../../../Helpers/ChangeItemInTree";

import blackArrow from "../../../Assets/images/directorytree/right-arrow-black.png";
import whiteArrow from "../../../Assets/images/directorytree/right-arrow-white.png";
import redArrow from "../../../Assets/images/directorytree/right-arrow-red.png";

import directory from "../../../Assets/images/folder.png";
import driveIcon from "../../../Assets/images/drive.png";

export default function ChildDir({ child }) {
  const { state, dispatch } = useContext(GeneralContext);
  const { path, name, permission, type } = child;

  const isDrive = type === "drive";

  function clickDirectory(toOpenDirectory) {
    if (!path.startsWith(state.drive) || !state.drive || isDrive) {
      let drive = isDrive ? name : path.slice(0, 2);
      dispatch({ type: "setDriveName", value: drive + "/" });
    }
    if (toOpenDirectory) {
      dispatch({
        type: "openDirectory",
        value: path + "/",
      });
      return;
    }
    fetch("/api/directorytree", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: path }),
    }).then(async (res) => {
      const response = await res.json();
      dispatch({
        type: "updateDirectoryTree",
        value: addToDirectoryTree(state.directoryTree, path, response),
      });
    });
  }

  return (
    <div
      onClick={(e) => {
        if (!permission) {
          return;
        }
        clickDirectory(true);
        e.stopPropagation();
      }}
      className={`tree--closed-directory ${!permission && "no-permission"}`}
      id={path + "/" === state.currentDirectory ? "highlight--child" : ""}
    >
      <img
        onClick={(e) => {
          if (!permission) {
            return;
          }
          clickDirectory(false);
          e.stopPropagation();
        }}
        className="tree--arrow"
        src={
          permission
            ? path + "/" === state.currentDirectory
              ? blackArrow
              : whiteArrow
            : redArrow
        }
        alt="expand directory"
      />
      <img
        src={!isDrive ? directory : driveIcon}
        alt="folder"
        className="directory--icon"
      />
      {name}
    </div>
  );
}

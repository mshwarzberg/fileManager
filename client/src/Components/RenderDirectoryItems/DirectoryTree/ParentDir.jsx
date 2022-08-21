import React, { useContext } from "react";
import { GeneralContext } from "../../Main/App";
import { expandAndCollapseDirectory } from "../../../Helpers/ChangeItemInTree";

import directoryIcon from "../../../Assets/images/folder.png";
import monitorIcon from "../../../Assets/images/monitor.png";

import blackArrow from "../../../Assets/images/directorytree/down-arrow-black.png";
import whiteArrow from "../../../Assets/images/directorytree/down-arrow-white.png";
import redArrow from "../../../Assets/images/directorytree/down-arrow-red.png";

export default function ParentDir({ parentDir, altImage, children }) {
  const { path, name, permission, collapsed, isDirectory, isDrive } = parentDir;
  const { state, dispatch } = useContext(GeneralContext);

  function isInPath() {
    if (
      path + "/" === state.currentDirectory &&
      state.currentDirectory.includes(name + "/")
    ) {
      return "highlight--child";
    } else if (state.currentDirectory.startsWith(path) || !path) {
      return "tree--in-path";
    }
    return "";
  }

  function sideIcon() {
    if (!name) {
      return monitorIcon;
    }
    if (altImage(name)) {
      return altImage(name);
    }
    return directoryIcon;
  }

  return (
    <div className="tree--expanded-chunk">
      <div
        className="line--down"
        onClick={() => {
          dispatch({
            type: "updateDirectoryTree",
            value: expandAndCollapseDirectory(state.directoryTree, path, true),
          });
        }}
      />
      <p
        data-contextmenu={["rename", "properties", "cutcopy"]}
        className={
          collapsed ? "tree--closed-directory" : "tree--open-directory"
        }
        id={isInPath()}
        onClick={(e) => {
          e.stopPropagation();
          dispatch({ type: "openDirectory", value: path ? path + "/" : "" });
          if (!path.startsWith(state.drive)) {
            dispatch({ type: "setDriveName", value: path.slice(0, 4) });
          }
        }}
        data-info={
          permission && (isDrive || isDirectory)
            ? JSON.stringify(parentDir)
            : null
        }
        data-destination={
          (isDirectory || isDrive) && permission
            ? JSON.stringify({ path: path })
            : null
        }
      >
        <img
          onClick={(e) => {
            e.stopPropagation();
            if (!name) {
              return;
            }
            if (collapsed) {
              return dispatch({
                type: "updateDirectoryTree",
                value: expandAndCollapseDirectory(state.directoryTree, path),
              });
            }
            dispatch({
              type: "updateDirectoryTree",
              value: expandAndCollapseDirectory(
                state.directoryTree,
                path,
                true
              ),
            });
          }}
          className={`tree--arrow ${collapsed ? "rotate-me" : ""}`}
          src={
            permission
              ? path + "/" === state.currentDirectory
                ? blackArrow
                : whiteArrow
              : redArrow
          }
          alt="close tree"
        />
        <img src={sideIcon()} alt="folder" className="side--icon" />
        {name || "This PC"}
      </p>
      <div className={`opendirectory--list ${collapsed ? "hide-me" : ""}`}>
        {children}
      </div>
    </div>
  );
}

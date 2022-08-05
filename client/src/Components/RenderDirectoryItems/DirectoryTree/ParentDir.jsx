import React, { useContext } from "react";
import { GeneralContext } from "../../Main/App";
import { expandAndCollapseDirectory } from "../../../Helpers/ChangeItemInTree";

import directoryIcon from "../../../Assets/images/folder.png";
import driveIcon from "../../../Assets/images/drive.png";
import monitorIcon from "../../../Assets/images/monitor.png";

import blackArrow from "../../../Assets/images/directorytree/down-arrow-black.png";
import whiteArrow from "../../../Assets/images/directorytree/down-arrow-white.png";
import redArrow from "../../../Assets/images/directorytree/down-arrow-red.png";

export default function ParentDir({ parentDir, children }) {
  const { path, name, permission, type, collapsed } = parentDir;
  const { state, dispatch } = useContext(GeneralContext);

  const isDrive = type === "drive";

  function isInPath() {
    if (path + "/" === state.currentDirectory) {
      return "highlight--child";
    } else if (state.currentDirectory.startsWith(path) || !path) {
      return "tree--in-path";
    }
    return "";
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
        className={
          collapsed ? "tree--closed-directory" : "tree--open-directory"
        }
        id={isInPath()}
        onClick={(e) => {
          dispatch({ type: "openDirectory", value: path ? path + "/" : "" });
          if (!path.startsWith(state.drive)) {
            dispatch({ type: "setDriveName", value: path.slice(0, 4) });
          }
          e.stopPropagation();
        }}
      >
        <img
          onClick={(e) => {
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
            e.stopPropagation();
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
        <img
          src={name ? (!isDrive ? directoryIcon : driveIcon) : monitorIcon}
          alt="folder"
          className="directory--icon"
        />
        {name || "This PC"}
      </p>
      <div className={`opendirectory--list ${collapsed ? "hide-me" : ""}`}>
        {children}
      </div>
    </div>
  );
}

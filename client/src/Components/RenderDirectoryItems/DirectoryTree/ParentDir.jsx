import React, { useContext } from "react";
import { DirectoryContext } from "../../Main/App";
import DownArrowBlack from "../../../Assets/images/directorytree/down-arrow-black.png";
import DownArrowAccented from "../../../Assets/images/directorytree/down-arrow-accented.png";
import DownArrowWhite from "../../../Assets/images/directorytree/down-arrow-white.png";

import directory from "../../../Assets/images/folder.png";
import { IsInPath } from "../../../Helpers/IsInPath";
// import ParentDirectoriesToArray from "../../../Helpers/ParentDirectoriesToArray";
// import changeItem from "../../../Helpers/ChangeItemInTree";

export default function ParentDir(props) {
  const { parentDirectoryName, parentDirectory, path } = props;

  const { state, dispatch } = useContext(DirectoryContext);

  return (
    <div className="tree--expanded-chunk">
      <div className="line--down" />
      <p
        className="tree--open-directory"
        title={path || "/"}
        onMouseEnter={(e) => {
          IsInPath(parentDirectoryName, path, state.currentDirectory);
          if (
            path !== state.currentDirectory &&
            e.currentTarget.id !== "tree--in-path"
          ) {
            e.currentTarget.firstChild.src = DownArrowWhite;
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.firstChild.src = DownArrowBlack;
        }}
        id={
          path === state.currentDirectory
            ? "highlight--child"
            : IsInPath(parentDirectoryName, path, state.currentDirectory)
            ? "tree--in-path"
            : ""
        }
        onClick={(e) => {
          dispatch({
            type: "openDirectory",
            value: path,
          });
          e.stopPropagation();
        }}
      >
        <img
          onMouseEnter={(e) => {
            if (
              path !== state.currentDirectory &&
              e.currentTarget.offsetParent.id !== "tree--in-path"
            ) {
              e.target.src = DownArrowAccented;
            }
          }}
          onMouseLeave={(e) => {
            if (
              path !== state.currentDirectory &&
              e.currentTarget.offsetParent.id !== "tree--in-path"
            ) {
              e.target.src = DownArrowWhite;
            }
          }}
          onClick={(e) => {
            // let dirName =
            //   typeof parentDirectoryName === "object"
            //     ? parentDirectoryName[0]
            //     : parentDirectoryName;
            // dispatch({
            //   type: "updateDirectoryTree",
            //   value: changeItem(
            //     state.directoryTree,
            //     ParentDirectoriesToArray(path),
            //     0,
            //     dirName
            //   ),
            // });
            // e.stopPropagation();
          }}
          className="tree--arrow"
          src={DownArrowBlack}
          alt="close tree"
        />
        <img
          src={localStorage.getItem("folder") || directory}
          alt="folder"
          className="directory--icon"
        />
        {parentDirectoryName || "/"}
      </p>

      <div className="opendirectory--list">{parentDirectory}</div>
    </div>
  );
}

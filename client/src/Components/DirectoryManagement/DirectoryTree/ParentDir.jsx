import React, { useContext } from "react";
import DownArrowBlack from "../../../Assets/images/directorytree/down-arrow-black.png";
import DownArrowAccented from "../../../Assets/images/directorytree/down-arrow-accented.png";
import DownArrowWhite from "../../../Assets/images/directorytree/down-arrow-white.png";

import FolderIcon from "../../../Assets/images/folder.png";
import ParentDirectoriesToArray from "../../../Helpers/ParentDirectoriesToArray";
import { RenderPath } from "../../../Helpers/RenderPath";
import useUpdateDirectoryTree from "../../../Hooks/useUpdateDirectoryTree";

import { DirectoryStateContext } from "../../../App";

export default function ParentDir(props) {
  const { parentDirectoryName, parentDirectory, path } = props;
  const changeItem = useUpdateDirectoryTree();
  const { state, dispatch } = useContext(DirectoryStateContext);

  return (
    <div className="tree--expanded-chunk">
      <div className="line--down" />
      <p
        className="tree--open-directory"
        title={path}
        onMouseEnter={(e) => {
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
            : RenderPath(parentDirectoryName, path, state.currentDirectory)
            ? "tree--in-path"
            : ""
        }
        onClick={(e) => {
          dispatch({
            type: "parentDirectory",
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
            dispatch({
              type: "updateDirectoryTree",
              value: changeItem(
                state.directoryTree,
                ParentDirectoriesToArray(path),
                0,
                parentDirectoryName
              ),
            });
            e.stopPropagation();
          }}
          className="tree--arrow"
          src={DownArrowBlack}
          alt="close tree"
        />
        <img src={FolderIcon} alt="folder" className="folder--icon" />
        {parentDirectoryName}
      </p>

      <div className="opendirectory--list">{parentDirectory}</div>
    </div>
  );
}

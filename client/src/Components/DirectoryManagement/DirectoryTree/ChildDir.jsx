import React, { useContext } from "react";
import { DirectoryStateContext } from "../../../App";
import useUpdateDirectoryTree from "../../../Hooks/useUpdateDirectoryTree";
import useFetch from "../../../Hooks/useFetch";
import ParentDirectoriesToArray from "../../../Helpers/ParentDirectoriesToArray";
import RightArrowBlack from "../../../Assets/images/directorytree/right-arrow-black.png";
import RightArrowWhite from "../../../Assets/images/directorytree/right-arrow-white.png";
import RightArrowAccented from "../../../Assets/images/directorytree/right-arrow-accented.png";
import FolderIcon from "../../../Assets/images/folder.png";

export default function ChildDir(props) {
  const { path, subItem } = props;
  const { state, dispatch } = useContext(DirectoryStateContext);
  
  const { data: directories } = useFetch(
    "/api/senddirectories",
    JSON.stringify({ path: path }), true
  );

  const changeItem = useUpdateDirectoryTree();
  function expandDirectory(toOpenDirectory) {
    // if a user clicks on the down caret don't open the directory. Instead just expand to the child directories
    if (toOpenDirectory) {
      dispatch({
        type: "openDirectory",
        value: path,
      });
    }
    
    if (directories) {
      dispatch({
        type: "updateDirectoryTree",
        value: changeItem(
          state.directoryTree,
          ParentDirectoriesToArray(path),
          0,
          directories.array
        ),
      });
    }
  }

  return (
    <div
      onClick={(e) => {
        expandDirectory(true);
        e.stopPropagation();
      }}
      className="tree--closed-directory"
      id={path === state.currentDirectory ? "highlight--child" : ""}
      title={`Name: ${subItem}\nPath: ${path}`}
    >
      <img
        onMouseEnter={(e) => {
          if (path !== state.currentDirectory) {
            return (e.target.src = RightArrowAccented);
          }
        }}
        onMouseLeave={(e) => {
          if (path !== state.currentDirectory) {
            return (e.target.src = RightArrowWhite);
          }
        }}
        onClick={(e) => {
          expandDirectory(false);
          e.stopPropagation();
        }}
        className="tree--arrow"
        src={
          path === state.currentDirectory
            ? RightArrowBlack
            : RightArrowWhite
        }
        alt=""
      />
      <img src={FolderIcon} alt="" className="folder--icon" />
      {subItem}
    </div>
  );
}

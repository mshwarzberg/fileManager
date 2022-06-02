import React, { useContext } from "react";
import { DirectoryContext } from "../../Main/App";
import useUpdateDirectoryTree from "../../../Hooks/useUpdateDirectoryTree";
import useFetch from "../../../Hooks/useFetch";
import ParentDirectoriesToArray from "../../../Helpers/ParentDirectoriesToArray";
import RightArrowBlack from "../../../Assets/images/directorytree/right-arrow-black.png";
import RightArrowWhite from "../../../Assets/images/directorytree/right-arrow-white.png";
import RightArrowAccented from "../../../Assets/images/directorytree/right-arrow-accented.png";
import FolderIcon from "../../../Assets/images/folder.png";

export default function ChildDir(props) {
  const { path, subItem } = props;
  const { state, dispatch } = useContext(DirectoryContext);

  const { data: directories } = useFetch(
    "/api/senddirectories",
    JSON.stringify({ path: path })
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
        if (!subItem.includes("*?<>")) {
          expandDirectory(true);
        }
        e.stopPropagation();
      }}
      className={`tree--closed-directory ${
        subItem.includes("*?<>") && "no-permission"
      }`}
      id={path === state.currentDirectory ? "highlight--child" : ""}
      title={`Name: ${
        subItem.includes("*?<>") ? subItem.slice(0, subItem.length - 4) : path
      }\nPath: ${
        subItem.includes("*?<>") ? path.slice(0, path.length - 4) : path
      }\n${subItem.includes('*?<>') && 'NO ACCESS'}`}
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
          path === state.currentDirectory ? RightArrowBlack : RightArrowWhite
        }
        alt="expand directory"
      />
      <img src={FolderIcon} alt="folder" className="folder--icon" />
      {subItem.includes("*?<>")
        ? subItem.slice(0, subItem.length - 4)
        : subItem}
    </div>
  );
}

import React, { useContext } from "react";
import { DirectoryStateContext } from "../../../../App";
import useUpdateDirectoryTree from "../../../../Hooks/useUpdateDirectoryTree";
import useFetch from "../../../../Hooks/useFetch";

import RightArrowBlack from "../../../../Assets/images/right-arrow-black.png";
import RightArrowWhite from "../../../../Assets/images/right-arrow-white.png";
import RightArrowRed from "../../../../Assets/images/right-arrow-red.png";
import FolderIcon from "../../../../Assets/images/folder.png";

export default function ChildDir(props) {
  const { addToPath, subItem, margin } = props;
  const { state, dispatch } = useContext(DirectoryStateContext);

  const { data: directories } = useFetch(
    "/api/getdirectories",
    JSON.stringify({ path: `./root/${addToPath}/${subItem}` })
  );

  const changeItem = useUpdateDirectoryTree();

  function expandDirectory(toOpenDirectory) {
    let parentDirs = [];
    parentDirs = addToPath?.split("/");

    parentDirs.push(subItem);
    if (parentDirs[0] === "") {
      parentDirs = parentDirs.slice(1, parentDirs.length);
    }
    // if a user clicks on the down caret don't open the directory. Instead just expand to the child directories
    if (toOpenDirectory) {
      dispatch({
        type: "openDirectory",
        value: `./root${addToPath && "/" + addToPath}/${subItem}`,
      });
    }

    if (directories) {
      dispatch({
        type: "updateDirectoryTree",
        value: changeItem(
          state.directoryTree,
          parentDirs,
          0,
          directories.array
        ),
      });
    }
  }

  return (
    <p
      onMouseEnter={(e) => {
        e.currentTarget.firstChild.src = RightArrowBlack;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.firstChild.src = RightArrowWhite;
      }}
      onClick={(e) => {
        expandDirectory(true);
        e.stopPropagation();
      }}
      style={{ marginLeft: `${margin * 4}px` }}
      className="tree--closed-directory"
      id={
        `./root/${addToPath}/${subItem}` === state.currentDirectory
          ? "highlight--child"
          : ""
      }
      title={`Name: ${subItem}\nPath: ${`./root${
        addToPath && "/" + addToPath
      }/${subItem}`}`}
    >
      <img
        onMouseEnter={(e) => {
          e.target.src = RightArrowRed;
        }}
        onMouseLeave={(e) => {
          e.target.src = RightArrowBlack;
        }}
        onClick={(e) => {
          expandDirectory(false);
          e.stopPropagation();
        }}
        className="tree--arrow"
        src={RightArrowWhite}
        alt=""
      />
      <img src={FolderIcon} alt="" className="folder--icon"/>{subItem}
    </p>
  );
}

import React, { useContext } from "react";

import DownArrowBlack from "../../../../Assets/images/down-arrow-black.png";
import DownArrowRed from "../../../../Assets/images/down-arrow-red.png";
import DownArrowWhite from "../../../../Assets/images/down-arrow-white.png";
import FolderIcon from "../../../../Assets/images/folder.png";

import useUpdateDirectoryTree from "../../../../Hooks/useUpdateDirectoryTree";
import { DirectoryStateContext } from "../../../../App";
import HighlightDirectory from "../../../../Helpers/HightlightDirectory";

export default function ParentDir(props) {
  const { openDirectoryName, margin, openDirectory, path } = props;

  const changeItem = useUpdateDirectoryTree();
  const { state, dispatch } = useContext(DirectoryStateContext);

  return (
    <div
      style={{
        marginLeft: `${margin * 4}px`,
      }}
      className="tree--expanded-chunk"
    >
      <div className="line--down" />
      <p
        className={"tree--open-directory"}
        title={`./root${path && "/" + path}/${openDirectoryName}`}
        onMouseEnter={(e) => {
          console.log(e.currentTarget);
          e.currentTarget.firstChild.src = DownArrowWhite;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.firstChild.src = DownArrowBlack;
        }}
        id={
          HighlightDirectory(
            `./root${path && "/" + path}/${openDirectoryName}`,
            state.currentDirectory
          )
            ? "highlight--parent"
            : `./root${path && "/" + path}/${openDirectoryName}` ===
              state.currentDirectory
            ? "highlight--child"
            : ""
        }
        onClick={() => {
          console.log(`./root${path && "/" + path}/${openDirectoryName}`);
        }}
      >
        <img
          onMouseEnter={(e) => {
            e.target.src = DownArrowRed;
          }}
          onMouseLeave={(e) => {
            e.target.src = DownArrowWhite;
          }}
          onClick={(e) => {
            let parentDirs = `${path}/${openDirectoryName}`;
            parentDirs = parentDirs.split("/");
            if (parentDirs[0] === "") {
              parentDirs = parentDirs.slice(1, parentDirs.length);
            }

            dispatch({
              type: "updateDirectoryTree",
              value: changeItem(
                state.directoryTree,
                parentDirs,
                0,
                openDirectoryName
              ),
            });
            e.stopPropagation();
          }}
          className="tree--arrow"
          src={DownArrowBlack}
          alt=""
        />
        <img src={FolderIcon} alt="" className="folder--icon" />
        {openDirectoryName}
      </p>
      <div
        style={{
          marginLeft: `${margin * 7}px`,
        }}
      >
        {openDirectory}
      </div>
    </div>
  );
}

import React, { useContext } from "react";
import { GeneralContext } from "../../Main/App";
import changeItem from "../../../Helpers/ChangeItemInTree";
import ParentDirectoriesToArray from "../../../Helpers/ParentDirectoriesToArray";
import RightArrowBlack from "../../../Assets/images/directorytree/right-arrow-black.png";
import RightArrowWhite from "../../../Assets/images/directorytree/right-arrow-white.png";
import RightArrowAccented from "../../../Assets/images/directorytree/right-arrow-accented.png";
import RightArrowRed from "../../../Assets/images/directorytree/right-arrow-red.png";
import directory from "../../../Assets/images/folder.png";
import driveIcon from "../../../Assets/images/drive.png";

export default function ChildDir({ path, subItem }) {
  const { state, dispatch } = useContext(GeneralContext);

  function expandDirectory(toOpenDirectory) {
    // if a user clicks on the down caret don't open the directory. Instead just expand to the child directories
    if (toOpenDirectory) {
      dispatch({
        type: "openDirectory",
        value: path + "/",
      });
      if (subItem.includes(":") || !path.startsWith(state.drive)) {
        let drive = subItem.includes(":") ? subItem : path.slice(0, 2);
        dispatch({ type: "setDriveName", value: drive + "/" });
      }
    }
    fetch("/api/directorytree", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: path.length === 2 ? path + "/" : path }),
    }).then(async (res) => {
      const response = await res.json();
      dispatch({
        type: "updateDirectoryTree",
        value: changeItem(
          state.directoryTree,
          ParentDirectoriesToArray(path),
          1,
          response
        ),
      });
    });
  }

  return (
    <div
      onClick={(e) => {
        if (subItem.includes("*/")) {
          return;
        }
        expandDirectory(true);
        e.stopPropagation();
      }}
      className={`tree--closed-directory ${
        subItem.includes("*/") && "no-permission"
      }`}
      id={path + "/" === state.currentDirectory ? "highlight--child" : ""}
      data-title={`Name: ${
        subItem.includes("*/") ? subItem.slice(0, subItem.length - 2) : subItem
      }\nPath: ${
        subItem.includes("*/") ? path.slice(0, path.length - 2) : path
      }\n${subItem.includes("*/") ? "NO ACCESS" : ""}`}
    >
      <img
        onMouseEnter={(e) => {
          if (path !== state.currentDirectory && !subItem.includes("*/")) {
            return (e.target.src = RightArrowAccented);
          }
        }}
        onMouseLeave={(e) => {
          if (path !== state.currentDirectory && !subItem.includes("*/")) {
            return (e.target.src = RightArrowWhite);
          }
        }}
        onClick={(e) => {
          if (subItem.includes("*/")) {
            return;
          }
          expandDirectory(false);
          e.stopPropagation();
        }}
        className="tree--arrow"
        src={
          subItem.includes("*/")
            ? RightArrowRed
            : path === state.currentDirectory
            ? RightArrowBlack
            : RightArrowWhite
        }
        alt="expand directory"
      />
      <img
        src={!subItem.includes(":") ? directory : driveIcon}
        alt="folder"
        className="directory--icon"
      />
      {subItem.includes("*/") ? subItem.slice(0, subItem.length - 2) : subItem}
    </div>
  );
}

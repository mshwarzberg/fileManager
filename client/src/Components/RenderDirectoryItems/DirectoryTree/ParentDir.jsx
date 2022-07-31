import React, { useContext, useRef, useState, useEffect } from "react";
import { GeneralContext } from "../../Main/App";
import DownArrowBlack from "../../../Assets/images/directorytree/down-arrow-black.png";
import DownArrowAccented from "../../../Assets/images/directorytree/down-arrow-accented.png";
import DownArrowWhite from "../../../Assets/images/directorytree/down-arrow-white.png";

import directoryIcon from "../../../Assets/images/folder.png";
import { IsInPath } from "../../../Helpers/IsInPath";
import driveIcon from "../../../Assets/images/drive.png";
import monitorIcon from "../../../Assets/images/monitor.png";

export default function ParentDir(props) {
  const { parentDirectoryName, parentDirectory, path } = props;

  const { state, dispatch } = useContext(GeneralContext);

  const listRef = useRef();

  function showHideList(element) {
    listRef.current.classList.toggle("hide");
    if (listRef.current.classList[1] === "hide") {
      element.className = "tree--closed-directory";
      setTimeout(() => {
        listRef.current.style.display = "none";
      }, 200);
    } else {
      element.className = "tree--open-directory";
      listRef.current.style.display = "block";
    }
  }

  return (
    <div className="tree--expanded-chunk">
      <div
        className="line--down"
        onClick={(e) => {
          showHideList(e.target.nextElementSibling);
        }}
      />
      <p
        className="tree--open-directory"
        data-title={`Name: ${
          parentDirectoryName.includes("*?<>")
            ? parentDirectoryName.slice(0, parentDirectoryName.length - 4)
            : parentDirectoryName
        }\nPath: ${
          parentDirectoryName.includes("*?<>")
            ? path.slice(0, path.length - 4)
            : path
        }\n${parentDirectoryName.includes("*?<>") ? "NO ACCESS" : ""}`}
        id={
          path + "/" === state.currentDirectory
            ? "highlight--child"
            : IsInPath(parentDirectoryName, path, state.currentDirectory)
            ? "tree--in-path"
            : ""
        }
        onClick={(e) => {
          dispatch({
            type: "openDirectory",
            value: path ? path + "/" : "",
          });
          if (
            parentDirectoryName.includes(":") ||
            !path.startsWith(state.drive)
          ) {
            let drive = parentDirectoryName.includes(":")
              ? parentDirectoryName
              : path.slice(0, 2);
            dispatch({ type: "setDriveName", value: drive + "/" });
          }
          e.stopPropagation();
        }}
      >
        <img
          onClick={(e) => {
            showHideList(e.target.parentElement);
            e.target.classList.toggle("hide");
            e.stopPropagation();
          }}
          onMouseMove={() => {
            if (listRef.current.classList[1] === "hide") {
            }
          }}
          className="tree--arrow"
          src={
            path + "/" === state.currentDirectory
              ? DownArrowBlack
              : DownArrowWhite
          }
          alt="close tree"
        />
        <img
          src={
            parentDirectoryName
              ? !parentDirectoryName.includes(":")
                ? directoryIcon
                : driveIcon
              : monitorIcon
          }
          alt="folder"
          className="directory--icon"
        />
        {parentDirectoryName || "This PC"}
      </p>
      <div className="opendirectory--list" ref={listRef}>
        {parentDirectory}
      </div>
    </div>
  );
}

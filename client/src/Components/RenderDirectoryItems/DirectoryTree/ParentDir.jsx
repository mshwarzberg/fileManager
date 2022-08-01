import React, { useContext, useRef, useState, useEffect } from "react";
import { GeneralContext } from "../../Main/App";
import DownArrowBlack from "../../../Assets/images/directorytree/down-arrow-black.png";
import DownArrowWhite from "../../../Assets/images/directorytree/down-arrow-white.png";

import directoryIcon from "../../../Assets/images/folder.png";
import { IsInPath } from "../../../Helpers/IsInPath";
import driveIcon from "../../../Assets/images/drive.png";
import monitorIcon from "../../../Assets/images/monitor.png";

export default function ParentDir(props) {
  const { parentDirectoryName, parentDirectory, path } = props;

  const { state, dispatch } = useContext(GeneralContext);
  const [hideList, setHideList] = useState(false);
  const listRef = useRef();

  useEffect(() => {
    if (hideList) {
      listRef.current.classList.add("hide");
      setTimeout(() => {
        listRef.current.style.display = "none";
      }, 200);
    } else {
      listRef.current.style.display = "block";
      listRef.current.classList.remove("hide");
    }
  }, [hideList]);

  return (
    <div className="tree--expanded-chunk">
      <div
        className="line--down"
        onClick={() => {
          // clicking on the line should always hide the directory list
          setHideList(false);
        }}
      />
      <p
        className={hideList ? "tree--closed-directory" : "tree--open-directory"}
        data-title={`Name: ${
          parentDirectoryName.includes("*/")
            ? parentDirectoryName.slice(0, parentDirectoryName.length - 2)
            : parentDirectoryName
        }\nPath: ${
          parentDirectoryName.includes("*/")
            ? path.slice(0, path.length - 2)
            : path
        }\n${parentDirectoryName.includes("*/") ? "NO ACCESS" : ""}`}
        id={path + "/" === state.currentDirectory ? "highlight--child" : ""}
        onClick={(e) => {
          e.currentTarget.className = "tree--open-directory";
          if (!path) {
            dispatch({
              type: "openDirectory",
              value: "",
            });
            return dispatch({
              type: "setDriveName",
              value: "",
            });
          }
          setHideList(true);
          dispatch({
            type: "openDirectory",
            value: path + "/",
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
          if (listRef.current.classList[1] === "hide") {
            listRef.current.classList.remove("hide");
            listRef.current.style.display = "block";
          }
          e.stopPropagation();
        }}
      >
        <img
          onClick={(e) => {
            setHideList(!hideList);
            if (hideList) {
              e.target.classList.remove("hide");
            } else {
              e.target.classList.add("hide");
            }
            e.stopPropagation();
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

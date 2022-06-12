import React, { useContext } from "react";
import { DirectoryContext } from "../../../Main/App";
import folder from "../../../../Assets/images/folder.png";
import symlink from "../../../../Assets/images/symlink.png";
import drive from "../../../../Assets/images/drive.png";
import Filename from "../Filename";
import CustomIcon from "./CustomIcon";

function Icon(props) {
  const { dispatch } = useContext(DirectoryContext);

  const { item, index } = props;

  const {
    name,
    shorthandsize,
    fileextension,
    thumbnail,
    isFile,
    permission,
    path,
    linkTo,
    isSymbolicLink,
    isDirectory,
    isDrive,
  } = item;

  function displayIcon() {
    if (isFile) {
      return <CustomIcon fileextension={fileextension} index={index} />;
    }
    if (isDirectory || isSymbolicLink) {
      return (
        <img
          src={
            isSymbolicLink
              ? localStorage.getItem("symlink") || symlink
              : localStorage.getItem("folder") || folder
          }
          alt="fileicon"
          className="renderitem--full-icon"
          data-index={index}
        />
      );
    }
    if (isDrive) {
      return (
        <img
          src={drive}
          alt="fileicon"
          className="renderitem--full-icon"
          data-index={index}
        />
      );
    }
  }

  return (
    !thumbnail && (
      <>
        <div
          className="renderitem--block"
          title={
            !isDrive
              ? `Name: ${name}${
                  shorthandsize ? "\nSize: " + shorthandsize : ""
                }\nType: ${fileextension}\nPath: ${path}\n${
                  !permission ? "NO ACCESS" : ""
                }`
              : ""
          }
          onClick={() => {
            if (isDirectory && permission && !isSymbolicLink) {
              dispatch({
                type: "openDirectory",
                value: path,
              });
            }
            if (isSymbolicLink && permission) {
              dispatch({
                type: "openDirectory",
                value: `${linkTo}`,
              });
            }
          }}
          style={{
            cursor: !permission ? "not-allowed" : "pointer",
            backgroundColor: !permission ? "#ff7878c5" : "",
            border: !permission ? "1.5px solid red" : "",
          }}
        >
          {displayIcon()}
          <Filename name={name} />
        </div>
      </>
    )
  );
}

export default Icon;

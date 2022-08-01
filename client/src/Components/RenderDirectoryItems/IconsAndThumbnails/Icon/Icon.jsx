import React, { useContext } from "react";
import { GeneralContext } from "../../../Main/App";
import folder from "../../../../Assets/images/folder.png";
import symlink from "../../../../Assets/images/symlink.png";
import drive from "../../../../Assets/images/drive.png";
import Filename from "./Filename";
import CustomIcon from "./CustomIcon";

function Icon(props) {
  const { dispatch } = useContext(GeneralContext);

  const {
    name,
    fileextension,
    isFile,
    permission,
    path,
    linkTo,
    isSymbolicLink,
    isDirectory,
    isDrive,
  } = props.item;

  function displayIcon() {
    if (isFile) {
      return <CustomIcon fileextension={fileextension} />;
    }
    if (isDirectory || isSymbolicLink) {
      return (
        <img
          src={isSymbolicLink ? symlink : folder}
          alt="foldericon"
          className="renderitem--full-icon"
        />
      );
    }
    if (isDrive) {
      return (
        <img src={drive} alt="fileicon" className="renderitem--full-icon" />
      );
    }
  }

  return (
    <div
      className="block-container"
      onClick={() => {
        if (isDirectory && permission && !isSymbolicLink) {
          dispatch({
            type: "openDirectory",
            value: path + "/",
          });
        }
        if (isSymbolicLink && permission) {
          dispatch({
            type: "openDirectory",
            value: linkTo + "/",
          });
        }
      }}
    >
      {displayIcon()}
      <Filename name={name} />
    </div>
  );
}

export default Icon;

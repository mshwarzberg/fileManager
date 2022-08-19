import React from "react";
import folder from "../../../../Assets/images/folder.png";
import symlink from "../../../../Assets/images/symlink.png";
import drive from "../../../../Assets/images/drive.png";
import Filename from "./Filename";
import CustomIcon from "./CustomIcon";

function Icon(props) {
  const { name, fileextension, isFile, isSymbolicLink, isDirectory, isDrive } =
    props.directoryItem;

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
    <div className="block-container">
      {displayIcon()}
      <Filename name={name} />
    </div>
  );
}

export default Icon;

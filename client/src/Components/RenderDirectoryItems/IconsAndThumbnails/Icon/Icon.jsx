import React from "react";
import folder from "../../../../Assets/images/folder.png";
import symlink from "../../../../Assets/images/symlink.png";
import drive from "../../../../Assets/images/drive.png";
import Filename from "./Filename";
import CustomIcon from "./CustomIcon";
import FormatSize from "../../../../Helpers/FormatSize";

function Icon(props) {
  const {
    name,
    path,
    fileextension,
    isFile,
    isSymbolicLink,
    isDirectory,
    isDrive,
    totalSize,
    availableSpace,
  } = props.directoryItem;

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
        <img
          src={drive}
          alt="fileicon"
          className="renderitem--full-icon drive-icon"
        />
      );
    }
  }

  return (
    <div className="block-container">
      {displayIcon()}
      <Filename name={name} />
      {isDrive && (
        <>
          <div id="drive-available-space">
            <div style={{ width: (availableSpace / totalSize) * 100 + "%" }} />
          </div>
          <p>
            {FormatSize(availableSpace)} available of {FormatSize(totalSize)}
          </p>
        </>
      )}
    </div>
  );
}

export default Icon;

import React, { useState, useContext } from "react";
import { DirectoryStateContext } from "../../../App";
import ColorizeIcons from "../../../Helpers/ColorizeIcons";
import Filename from "./Filename";
import shortHandFileSize from "../../../Helpers/FileSize";

function Icon(props) {
  const { state, dispatch } = useContext(DirectoryStateContext);
  const [directoryTitle, setDirectoryTitle] = useState({});

  const { item, changeFolderOrViewFiles, directoryItems } = props;
  const {
    name,
    shorthandsize,
    fileextension,
    itemtype,
    thumbnail,
    isFile,
    permission,
    isDirectory,
  } = item;

  const [displayIcon, setDisplayIcon] = useState();

  if (!displayIcon && !isFile) {
    import(`../../../Assets/images/folder.png`).then((image) => {
      setDisplayIcon(image.default);
    });
  }

  function displayTitle() {
    const title = `Name: ${name}\nSize: ${shorthandsize}\nType: ${fileextension}`;
    const notAllowed = `Name: ${name}\nNOT ALLOWED TO ACCESS`;

    const directoryTitleFormatted = `Name: ${name}\nSize: ${
      directoryTitle.bytes
    }\nCount: ${
      directoryTitle.filecount * 1 +
      directoryTitle.foldercount * 1 +
      ` items. (${directoryTitle.filecount} files, ${directoryTitle.foldercount} folders)`
    }`;
    if (isDirectory && permission) {
      if (!directoryTitle.bytes) {
        return "loading";
      }
      return directoryTitleFormatted;
    }
    if (!permission) {
      return notAllowed;
    }
    return title;
  }
  return (
    !thumbnail && (
      <div
        onMouseEnter={(e) => {
          if (isDirectory && permission && name !== directoryTitle.name) {
            e.target.style.cursor = "progress";
            fetch("/api/directorydata", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                path: state.currentDirectory + "/" + name,
              }),
            })
              .then((res) => {
                e.target.style.cursor = "default";
                return res.json()
              }).then((res) => {
                setDirectoryTitle({
                  bytes: shortHandFileSize(res.bytes),
                  filecount: res.filecount,
                  foldercount: res.foldercount,
                  name: name
                });
              })
              .catch((err) => {
                console.log(err);
                e.target.style.cursor = 'default'
              });
          }
        }}
        onMouseLeave={() => {}}
        className="renderfile--block"
        // if the item is a directory load the size of the directory first before displaying the title
        title={displayTitle()}
        onClick={() => {
          if (itemtype === "folder" && permission) {
            dispatch({
              type: "openDirectory",
              value: `${state.currentDirectory}${name && "/" + name}`,
            });
          }
          changeFolderOrViewFiles(itemtype, name, directoryItems.indexOf(item));
        }}
        style={{
          cursor: !permission ? "not-allowed" : "pointer",
          backgroundColor: !permission ? "#ff7878c5" : "",
          border: !permission ? "1.5px solid red" : "",
        }}
      >
        {isFile ? (
          <svg viewBox="0 0 100 100" style={{ position: "absolute" }}>
            <rect
              fill="#bbbbbb"
              x="10"
              y="-5"
              width="75"
              height="100"
              clipPath="polygon(100% 0, 100% 75%, 69% 100%, 0 100%, 0 0)"
            />
            <rect
              x="2"
              y="20"
              width="50"
              height="25"
              fill={ColorizeIcons(fileextension)}
              rx="1"
              ry="1"
            />
            <rect
              width="25"
              height="25"
              fill="white"
              y="70"
              x="61.4"
              clipPath="polygon(0 0, 0% 100%, 94% 0)"
            />
            <rect
              width="25"
              height="25"
              fill="#9f9f9f"
              y="70"
              x="36.3"
              clipPath="polygon(100% 0, 0% 100%, 100% 100%)"
            />
            <text
              fill={
                ColorizeIcons(fileextension) === "white" ? "black" : "white"
              }
              x="27"
              y={fileextension.length > 4 ? "36" : "40"}
              id="custom-icon-text"
              style={{
                fontSize: fileextension.length > 4 ? "0.6em" : "1.3em",
              }}
            >
              {fileextension.toUpperCase()}
            </text>
          </svg>
        ) : (
          <img
            src={displayIcon}
            alt="fileicon"
            className="renderfile--full-icon"
          />
        )}
        <Filename name={name} />
      </div>
    )
  );
}

export default Icon;

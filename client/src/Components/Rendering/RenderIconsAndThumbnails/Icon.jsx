import React, { useState, useContext } from "react";
import { DirectoryStateContext } from "../../../App";
import ColorizeIcons from "../../../Helpers/ColorizeIcons";
import Filename from "./Filename";

function Icon(props) {
  const { state, dispatch } = useContext(DirectoryStateContext);

  const { item, changeFolderOrViewFiles, directoryItems } = props;

  const { name, shorthandsize, fileextension, itemtype, thumbnail, isFile } =
    item;

  const [displayIcon, setDisplayIcon] = useState();

  if (!displayIcon && !isFile) {
    import(`../../../Assets/images/folder.png`).then((image) => {
      setDisplayIcon(image.default);
    });
  }

  return (
    !thumbnail && (
      <div
        className="renderfile--block"
        title={`Name: ${name}\nSize: ${shorthandsize}\nType: ${fileextension}`}
        onClick={() => {
          if (itemtype === "folder") {
            dispatch({
              type: "openDirectory",
              value: `${state.currentDirectory}${name && "/" + name}`,
            });
          }
          changeFolderOrViewFiles(itemtype, name, directoryItems.indexOf(item));
        }}
        style={{cursor: isFile && itemtype !== 'document' ? 'not-allowed' : 'pointer'}}
      >
        {isFile ? (
          <svg viewBox="0 0 100 100" style={{ position: "absolute" }}>
            <rect
              fill="#bbbbbb"
              x="10"
              y="-5"
              width="80"
              height="100"
              clipPath="polygon(100% 0, 100% 75%, 69% 100%, 0 100%, 0 0)"
            />
            <rect
              x="5"
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
              x="65"
              clipPath="polygon(0 0, 0% 100%, 100% 0)"
            />
            <rect
              width="25"
              height="25"
              fill="#9f9f9f"
              y="70"
              x="40"
              clipPath="polygon(100% 0, 0% 100%, 100% 100%)"
            />
            <text
              fill={
                ColorizeIcons(fileextension) === "white" ? "black" : "white"
              }
              x="27"
              y="40"
              id="custom-icon-text"
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

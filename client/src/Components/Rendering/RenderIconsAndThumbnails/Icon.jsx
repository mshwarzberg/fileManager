import React, { useState, useContext } from "react";
import { DirectoryStateContext } from "../../../App";
import ColorizeIcons from "../../../Helpers/ColorizeIcons";

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
      >
        {isFile ? (
          <svg viewBox="0 0 100 100">
            <rect
              fill="grey"
              x="10"
              y='-5'
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
            <text fill="white" x="13" y="38" width="25" height="25">
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
        <p className="renderfile--text">{name}</p>
      </div>
    )
  );
}

export default Icon;

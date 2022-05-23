import React, { useState, useContext } from "react";
import { DirectoryStateContext } from "../../../App";
import RandomChars from "../../../Helpers/RandomChars";
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
          <div id="custom-icon-full">
          <div/>
          <p id="custom-icon-text" style={{backgroundColor: '#' + RandomChars(6, '1234567890abcdef')}}>{fileextension.toUpperCase()}</p>
        </div>
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

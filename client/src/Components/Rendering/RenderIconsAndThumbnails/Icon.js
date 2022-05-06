import React, { useState } from "react";
import SliceName from "../../../Helpers/SliceName";

function Icon(props) {

  const { item, changeFolderOrViewFiles, itemsInDirectory } = props;
  
  const { name, shorthandsize, fileextension, itemtype, thumbnail, isFile } =
    item;

  const [displayIcon, setDisplayIcon] = useState();

  if (!displayIcon && isFile) {
    import(`../../../Assets/images/Icons/${fileextension}.png`)
      .then((image) => setDisplayIcon(image.default))
      .catch(() => {
        import(`../../../Assets/images/blank.png`).then((image) => {
          setDisplayIcon(image.default);
        });
      });
  } else if (!displayIcon) {
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
          changeFolderOrViewFiles(
            itemtype,
            name,
            itemsInDirectory.indexOf(item)
          );
        }}
      >
        <img
          src={displayIcon}
          alt="fileicon"
          className="renderfile--full-icon"
        />
        <p className="renderfile--text">{SliceName(name)}</p>
      </div>
    )
  );
}

export default Icon;

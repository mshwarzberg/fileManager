import React, { useState } from "react";

import SliceName from "../../../Helpers/SliceName";

export default function ImageGif(props) {
  const { item, changeFolderOrViewFiles, itemsInDirectory } = props;
  const { name, shorthandsize, fileextension, thumbnail, itemtype, isFile } =
    item;

  const [displayCornerIcon, setDisplayCornerIcon] = useState();

  if (!displayCornerIcon && isFile) {
    import(`../../../Assets/images/Icons/${fileextension.toLowerCase()}.png`)
      .then((image) => setDisplayCornerIcon(image.default))
      .catch(() => {
        import(`../../../Assets/images/blank.png`).then((image) => {
          setDisplayCornerIcon(image.default);
        });
      });
  }

  return (
    thumbnail &&
    (itemtype === "image" || itemtype === "gif") && (
      <div
        className="renderfile--block"
        id="renderfile--image-block"
        title={`Name: ${name}\nSize: ${shorthandsize}\nType: ${fileextension}`}
        onClick={() => {
          return changeFolderOrViewFiles(
            itemtype,
            name,
            itemsInDirectory.indexOf(item)
          );
        }}
      >
        <img
          src={thumbnail}
          alt="imagethumb"
          className="renderfile--thumbnail"
          id="renderfile--image-thumbnail"
        />
        <img
          src={displayCornerIcon}
          alt="imageicon"
          id="renderfile--corner-icon"
        />
        <p className="renderfile--text">{SliceName(name)}</p>
      </div>
    )
  );
}
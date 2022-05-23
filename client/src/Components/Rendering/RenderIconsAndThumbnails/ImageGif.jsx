import React from "react";
import CornerIcon from "./CornerIcon";
export default function ImageGif(props) {
  const { item, changeFolderOrViewFiles, directoryItems } = props;
  const { name, shorthandsize, fileextension, thumbnail, itemtype } = item;

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
            directoryItems.indexOf(item)
          );
        }}
      >
        <img
          src={thumbnail}
          alt="imagethumb"
          className="renderfile--thumbnail"
          id="renderfile--image-thumbnail"
        />
        <p className="renderfile--text">{name}</p>
        <CornerIcon fileextension={fileextension} />
      </div>
    )
  );
}

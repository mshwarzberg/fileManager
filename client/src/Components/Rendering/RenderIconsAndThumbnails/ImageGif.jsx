import React from "react";

export default function ImageGif(props) {
  const { item, changeFolderOrViewFiles, directoryItems } = props;
  const { name, shorthandsize, fileextension, thumbnail, itemtype, bgColor } = item;

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
        <div id="custom-icon-parent">
          <p
            id="custom-icon-text"
            style={{
              backgroundColor: bgColor,
            }}
          >
            {fileextension.toUpperCase()}
          </p>
          <div id="custom-icon">
            <div />
          </div>
        </div>
        <p className="renderfile--text">{name}</p>
      </div>
    )
  );
}

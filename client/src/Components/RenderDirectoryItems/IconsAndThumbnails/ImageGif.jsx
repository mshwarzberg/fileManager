import React, { useRef } from "react";
import Filename from "./Filename";

export default function ImageGif(props) {
  const { item, changeFolderOrViewFiles, directoryItems } = props;
  const {
    name,
    shorthandsize,
    fileextension,
    thumbnail,
    itemtype,
    height,
    width,
  } = item;
  const nameInput = useRef()
  return (
    thumbnail &&
    (itemtype === "image" || itemtype === "gif") && (
      <>
        <div
          className="renderfile--block"
          id="renderfile--image-block"
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
            title={`Name: ${name}\nSize: ${shorthandsize}\nType: ${fileextension}\nDimensions: ${width}x${height}`}
          />
          <Filename name={name} nameRef={nameInput}/>
        </div>
      </>
    )
  );
}

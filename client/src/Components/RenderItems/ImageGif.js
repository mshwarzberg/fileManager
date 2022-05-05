import React from "react";

import ChooseIcon from "../../Helpers/ChooseIcon";
import SliceName from "../../Helpers/SliceName";

export default function ImageGif(props) {
  
  const { name, shorthandsize, fileextension, thumbnail, itemtype } = props;

  return (
    thumbnail && (itemtype === "image" || itemtype === "gif") && (
      <div
        className="renderfile--block"
        id="renderfile--image-block"
        title={`Name: ${name}\nSize: ${shorthandsize}\nType: ${fileextension}`}
      >
        <img
          src={thumbnail}
          alt="imagethumb"
          className="renderfile--thumbnail"
          id="renderfile--image-thumbnail"
        />
        <img
          src={ChooseIcon(itemtype)}
          onMouseEnter={(e) => {
            e.currentTarget.src = ChooseIcon(itemtype, true);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.src = ChooseIcon(itemtype);
          }}
          alt="imageicon"
          id="renderfile--corner-icon"
        />
        <p className="renderfile--text">{SliceName(name)}</p>
      </div>
    )
  );
}

import React, { useState } from "react";

import playIcon from "../../../Assets/images/play.png";
import PlayIconHover from "../../../Assets/images/playhover.png";

function Video(props) {
  const { item, changeFolderOrViewFiles, directoryItems } = props;
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
    itemtype === "video" && (
      <div
        className="renderfile--block"
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
          alt="gifthumb"
          className="renderfile--thumbnail"
          id="renderfile--video-thumbnail"
        />
        <img
          src={playIcon}
          onMouseEnter={(e) => {
            e.currentTarget.src = PlayIconHover;
            e.stopPropagation();
          }}
          onMouseLeave={(e) => {
            e.currentTarget.src = playIcon;
          }}
          alt="playvideo"
          id="renderfile--play-icon"
          title={`Play "${name}"`}
        />
        <img
          src={displayCornerIcon}
          alt="imageicon"
          id="renderfile--corner-icon"
        />
        <p className="renderfile--text">{name}</p>
      </div>
    )
  );
}

export default Video;

import React from "react";
import RandomChars from "../../../Helpers/RandomChars";
import playIcon from "../../../Assets/images/play.png";
import PlayIconHover from "../../../Assets/images/playhover.png";

function Video(props) {
  const { item, changeFolderOrViewFiles, directoryItems } = props;
  const { name, shorthandsize, fileextension, thumbnail, itemtype } =
    item;

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
        <div id="custom-icon">
          <div/>
          <p id="custom-icon-text" style={{backgroundColor: '#' + RandomChars(6, '1234567890abcdef')}}>{fileextension.toUpperCase()}</p>
        </div>
      </div>
    )
  );
}

export default Video;

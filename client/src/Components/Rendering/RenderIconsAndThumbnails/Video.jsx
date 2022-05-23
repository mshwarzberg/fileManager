import React from "react";
import CornerIcon from "./CornerIcon";
import videoicon from '../../../Assets/images/video.png'
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
        onMouseEnter={(e) => {
          e.currentTarget.firstChild.style.display = 'block'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.firstChild.style.display = 'none'
        }}
      >
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
          style={{display: 'none', zIndex: 1}}
        />
        <img
          src={thumbnail}
          alt="gifthumb"
          className="renderfile--thumbnail"
          id="renderfile--video-thumbnail"
        />
        <img src={videoicon} alt="video" id="video-icon"/>
        <p className="renderfile--text">{name}</p>
        <CornerIcon fileextension={fileextension} />
      </div>
    )
  );
}

export default Video;

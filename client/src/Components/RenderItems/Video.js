import React from "react";
import SliceName from "../../Helpers/SliceName";
import playIcon from "../../Assets/images/play.png";
import lightPlayIcon from "../../Assets/images/playhover.png";

function Video(props) {
  const { name, shorthandsize, fileextension, thumbnail, itemtype } = props;

  return (
    thumbnail &&
    itemtype === "video" && (
      <div
        className="renderfile--block"
        title={`Name: ${name}\nSize: ${shorthandsize}\nType: ${fileextension}`}
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
            e.currentTarget.src = lightPlayIcon;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.src = playIcon;
          }}
          alt="playvideo"
          id="renderfile--play-icon"
        />
        <p className="renderfile--text">{SliceName(name)}</p>
      </div>
    )
  );
}

export default Video;

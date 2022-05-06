import React from "react";
import SliceName from "../../Helpers/SliceName";
import playIcon from "../../Assets/images/play.png";
import lightPlayIcon from "../../Assets/images/playhover.png";
import ChooseIcon from "../../Helpers/ChooseIcon";
function Video(props) {

  const { item, changeFolderOrViewFiles, itemsInDirectory } = props;
  const { name, shorthandsize, fileextension, thumbnail, itemtype } = item

  return (
    thumbnail &&
    itemtype === "video" && (
      <div
        className="renderfile--block"
        title={`Name: ${name}\nSize: ${shorthandsize}\nType: ${fileextension}`}
        onClick={() => {
          return changeFolderOrViewFiles(itemtype, name, itemsInDirectory.indexOf(item))
        }}
      >
        <img
          src={thumbnail}
          alt="gifthumb"
          className="renderfile--thumbnail"
          id="renderfile--video-thumbnail"
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

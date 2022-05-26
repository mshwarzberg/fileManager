import React from "react";
import useScreenDimensions from "../../Hooks/useScreenDimensions";
import Back from "../../Assets/images/navigate-backwards.png";
import Forward from "../../Assets/images/navigate-forwards.png";

function ImageDisplay(props) {
  const {
    viewItem,
    fullscreen,
    changeFolderOrViewFiles,
    enterExitFullscreen,
  } = props;

  const { width } = useScreenDimensions();

  return (
    <div className="viewitem--block">
      {width < 800 && (
        <>
          <img
            id="button--backwards"
            src={Back}
            alt="back"
            onClick={() => {
              changeFolderOrViewFiles(
                viewItem.type,
                viewItem.name,
                viewItem.index,
                "backwards"
              );
            }}
          />
          <img
            id="button--forwards"
            src={Forward}
            alt="forward"
            onClick={() => {
              changeFolderOrViewFiles(
                viewItem.type,
                viewItem.name,
                viewItem.index,
                "forwards"
              );
            }}
          />
        </>
      )}
      <img
        onDoubleClick={() => {
          enterExitFullscreen();
        }}
        id={fullscreen ? "image-fullscreen" : ""}
        className="viewitem--item"
        src={viewItem.property}
        alt={viewItem.name}
      />
    </div>
  );
}

export default ImageDisplay;

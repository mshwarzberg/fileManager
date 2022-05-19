import React from "react";
import Back from "../../Assets/images/navigate-backwards.png";
import Forward from "../../Assets/images/navigate-forwards.png";
import useScreenDimensions from "../../Hooks/useScreenDimensions";

function VideoDisplay(props) {
  const { viewItem, fullscreen, changeFolderOrViewFiles, isNavigating } = props;
  const { width } = useScreenDimensions();

  return (
    <div className="viewitem--block" id="viewitem--block-video">
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
      {!fullscreen && isNavigating.visible && (
        <h1
          id="navigating--indicator"
          title={`Press "Tab" to toggle the visibility of this message`}
        >
          {isNavigating.value
              ? `Navigation Enabled: "CapsLock" to disable`
              : `Navigation Disabled: "CapsLock" to enable`}
        </h1>
      )}
      <video
        className="viewitem--item"
        id="viewitem--video"
        src={viewItem.property}
        muted
        controls
      />
    </div>
  );
}

export default VideoDisplay;

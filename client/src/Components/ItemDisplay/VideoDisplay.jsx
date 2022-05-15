import React, { useContext } from "react";
import DisplayHeaderAndClose from "./DisplayHeaderAndClose";
import { DisplayContext } from "../Rendering/RenderFiles";
import Back from "../../Assets/images/navigate-backwards.png";
import Forward from "../../Assets/images/navigate-forwards.png";
import useScreenDimensions from "../../Hooks/useScreenDimensions";

function VideoDisplay(props) {
  const { viewItem, fullscreen } = useContext(DisplayContext);
  const { width } = useScreenDimensions();

  return (
    <div className="viewitem--block" id="viewitem--block-video">
      <DisplayHeaderAndClose />
      {width < 800 && (
        <>
          <img
            id="button--backwards"
            src={Back}
            alt="back"
            onClick={() => {
              props.changeFolderOrViewFiles(
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
              props.changeFolderOrViewFiles(
                viewItem.type,
                viewItem.name,
                viewItem.index,
                "forwards"
              );
            }}
          />
        </>
      )}
      {!fullscreen && props.isNavigating.visible && (
        <h1
          id="navigating--indicator"
          title={`Press "Tab" to toggle the visibility of this message`}
        >
          {props.isNavigating.value
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

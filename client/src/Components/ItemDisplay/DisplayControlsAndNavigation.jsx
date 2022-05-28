import React from "react";
import Close from "../../Assets/images/close.png";
import alerticon from '../../Assets/images/alert.png'
import useScreenDimensions from "../../Hooks/useScreenDimensions";
import Back from "../../Assets/images/navigate-backwards.png";
import Forward from "../../Assets/images/navigate-forwards.png";

export default function DisplayControlsAndNavigation(props) {
  const { fullscreen,viewItem, setViewItem, setFullscreen, isNavigating, changeFolderOrViewFiles } = props;
  
  const { width } = useScreenDimensions();
  
  return (
    <>
      <h1 id="viewitem--filename">{viewItem.name}</h1>
      {!fullscreen && isNavigating.visible && (
        <div id="navigating-indicator">
          <img
            src={alerticon}
            alt=""
            title={`Press "Tab" to toggle the visibility of this message`}
          />
          <h1 id="navigating-indicator-popup">
            {isNavigating.value
              ? `Navigation Enabled: "CapsLock" to disable`
              : `Navigation Disabled: "CapsLock" to enable`}
          </h1>
        </div>
      )}
      <img
        src={Close}
        alt="close"
        className="viewitem--close"
        onClick={() => {
          setFullscreen(false);
          URL.revokeObjectURL(viewItem.property);
          setViewItem({
            type: null,
            property: null,
            index: null,
            name: null,
          });
        }}
      />
      {width < 900 && (
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
    </>
  );
}

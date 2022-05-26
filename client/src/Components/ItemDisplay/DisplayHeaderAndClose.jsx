import React from "react";
import Close from "../../Assets/images/close.png";
import alerticon from '../../Assets/images/alert.png'

export default function DisplayHeaderAndClose(props) {
  const { fullscreen,viewItem, setViewItem, setFullscreen, isNavigating } = props;

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
    </>
  );
}

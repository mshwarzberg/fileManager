import React from "react";
function VideoDisplay(props) {
  const { viewItem, setViewItem, enterExitFullscreen } = props;

  return (
    <div className="viewitem--block" id="viewitem--block-video">
      <button
        onClick={() => {
          enterExitFullscreen();
        }}
      >
        Enter/Exit Fullscreen
      </button>
      <h1 id="viewitem--filename">{viewItem.name}</h1>
      <button
        className="viewitem--close"
        onClick={() => {
          URL.revokeObjectURL(viewItem.property);
          setViewItem({
            type: null,
            property: null,
            index: null,
            name: null,
          });
        }}
      >
        X
      </button>
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

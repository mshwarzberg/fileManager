import React from "react";

function VideoDisplay(props) {
  const { viewItem, setViewItem } = props;

  return (
    viewItem.type === "video" && (
      <div id="viewitem--block">
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
        <video id="viewitem--item" src={viewItem.property}controls autoPlay />
      </div>
    )
  );
}

export default VideoDisplay;

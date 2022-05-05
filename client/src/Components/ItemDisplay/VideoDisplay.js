import React, { useContext } from "react";
import { ItemContext } from "../Main";

function VideoDisplay() {
  const { viewItem, setViewItem } = useContext(ItemContext);
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
        <video id="viewitem--item" controls autoPlay muted>
          <source src={`${viewItem.property}`} />
        </video>
      </div>
    )
  );
}

export default VideoDisplay;

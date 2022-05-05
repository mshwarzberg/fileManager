import React from "react";

function ImageDisplay(props) {
  const { viewItem, setViewItem } = props;

  return (
    viewItem.type === "imagegif" && (
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
        <img id="viewitem--item" src={viewItem.property} alt={viewItem.name} />
      </div>
    )
  );
}

export default ImageDisplay;

import React from "react";

function ImageDisplay(props) {
  const { viewItem, setViewItem, enterExitFullscreen, fullscreen } = props;

  return (
    <div className="viewitem--block">
      {!fullscreen && <h1 id="viewitem--filename">{viewItem.name}</h1>}
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
      <img
      onDoubleClick={() =>  {
        enterExitFullscreen()
      }}
      id={fullscreen ? 'image-fullscreen' : ''}
        className="viewitem--item"
        src={viewItem.property}
        alt={viewItem.name}
      />
    </div>
  );
}

export default ImageDisplay;

import React from "react";

function ItemDisplay(props) {
  const { viewDocument, viewVideo, viewImage, clear } = props;

  return (
    (viewImage.imageURL && (
      <div id="viewitem--block">
        <button
          className="viewitem--close"
          onClick={() => {
            clear();
          }}
        >
          X
        </button>
        <img
          id="viewitem--item"
          src={viewImage.imageURL}
          alt={viewImage.name}
        />
      </div>
    )) ||
    (viewVideo.path && (
      <div id="viewitem--block">
        <button
          className="viewitem--close"
          onClick={() => {
            clear();
          }}
        >
          X
        </button>
        <video id="viewitem--item" controls autoPlay muted >
          <source src={`${viewVideo.path}`}/>
        </video>
      </div>
    )) ||
    (viewDocument.document && (
      <div id="viewitem--block-document">
        <button
          className="viewitem--close"
          onClick={() => {
            clear();
          }}
        >
          X
        </button>
        <pre id="viewitem--document">{viewDocument.document}</pre>
      </div>
    ))
  );
}

export default ItemDisplay;

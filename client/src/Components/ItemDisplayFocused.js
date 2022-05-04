import React from "react";

function ItemDisplayFocused(props) {

  const { viewItem, clear } = props;

  return (
    (viewItem.type === 'imageIcon' && (
      <div id="viewitem--block">
        <h1 id="viewitem--filename">{viewItem.name}</h1>
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
          src={viewItem.property}
          alt={viewItem.name}
        />
      </div>
    )) ||
    (viewItem.type === 'videoIcon' && (
      <div id="viewitem--block">
        <h1 id="viewitem--filename">{viewItem.name}</h1>
        <button
          className="viewitem--close"
          onClick={() => {
            clear();
          }}
        >
          X
        </button>
        <video id="viewitem--item" controls autoPlay muted >
          <source src={`${viewItem.property}`}/>
        </video>
      </div>
    )) ||
    (viewItem.type === 'documentIcon' && (
      <div id="viewitem--block-document">
        <h1 id="viewitem--filename">{viewItem.name}</h1>
        <button
          className="viewitem--close"
          onClick={() => {
            clear();
          }}
        >
          X
        </button>
        <pre id="viewitem--document">{viewItem.property}</pre>
      </div>
    ))
  );
}

export default ItemDisplayFocused;

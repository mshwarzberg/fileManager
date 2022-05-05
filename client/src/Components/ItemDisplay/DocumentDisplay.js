import React from "react";
function DocumentDisplay(props) {
  const { viewItem, setViewItem } = props;

  return (
    viewItem.type === "document" && (
      <div id="viewitem--block-document">
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
        <pre id="viewitem--document">{viewItem.property}</pre>
      </div>
    )
  );
}

export default DocumentDisplay;

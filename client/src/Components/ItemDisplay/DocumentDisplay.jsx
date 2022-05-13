import React, { useState } from "react";
function DocumentDisplay(props) {
  const { viewItem, setViewItem, enterExitFullscreen, fullscreen } = props;
  const [editFile, setEditFile] = useState(viewItem.property);

  return (
    <div className="viewitem--block" id="viewitem--block-document">
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
      <textarea
        className="viewitem--item"
        onDoubleClick={() => {
          enterExitFullscreen();
        }}
        id="viewitem--document"
        value={editFile}
        onChange={(e) => {
          setEditFile(e.target.value);
        }}
        spellCheck={false}
      />
    </div>
  );
}

export default DocumentDisplay;

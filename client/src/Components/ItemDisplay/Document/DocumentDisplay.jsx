import React, { useState, useRef } from "react";

function DocumentDisplay(props) {
  const { viewItem, enterExitFullscreen } = props;
  const openDocument = useRef() 

  const [editFile, setEditFile] = useState(viewItem.property);
  const [isEditing, setIsEditing] = useState(openDocument.current?.disabled)

  return (
    <div
      className="viewitem--block"
      id="viewitem--block-document"
    >
      <div id="document--header">
        <button id="document--edit" onClick={() => {
          if (isEditing) {
            openDocument.current.disabled = true
          }
        }}>{openDocument.current?.disabled ? 'Edit' : 'View'}</button>
        <button>Save</button>
        <button onClick={() => {
          enterExitFullscreen()
        }}>Fullscreen</button>
      </div>
      <textarea
        ref={openDocument}
        className="viewitem--item"
        id="viewitem--document"
        value={editFile}
        onChange={(e) => {
          setEditFile(e.target.value);
        }}
        spellCheck={false}
        resize='false'
        disabled={true}
      />
    </div>
  );
}

export default DocumentDisplay;

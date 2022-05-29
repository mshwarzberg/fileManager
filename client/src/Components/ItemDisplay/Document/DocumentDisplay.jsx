import React, { useState, createContext, useRef } from "react";
import SaveDocument from "./SaveDocument";

export const MessageContext = createContext();

function DocumentDisplay(props) {
  const { viewItem, enterExitFullscreen, setViewItem, openDocument } = props;

  const [newDocument, setNewDocument] = useState(
    viewItem.property === " " ? "" : viewItem.property
  );

  const [isEditing, setIsEditing] = useState(true);
  const [message, setMessage] = useState();
  
  const saveButton = useRef();
  return (
    <div
      className="viewitem--block"
      id="viewitem--block-document"
      onKeyDown={(e) => {
        if (e.key === 's' && e.ctrlKey) {
          e.preventDefault()
          console.log('first')
        }
      }}
    >
      <div id="document--header">
        <button
          id="document--edit"
          onClick={() => {
            if (isEditing) {
              openDocument.current.disabled = true;
              return setIsEditing(false);
            } else {
              openDocument.current.disabled = false;
              setIsEditing(true);
            }
          }}
        >
          {isEditing ? "Lock" : "Edit"}
        </button>
        <MessageContext.Provider value={{ message, setMessage }}>
          <SaveDocument
            saveButton={saveButton}
            setViewItem={setViewItem}
            id=""
            viewItem={viewItem}
            openDocument={openDocument}
            newDocument={newDocument}
            disabled={viewItem.property === newDocument || !newDocument}
            text="Save"
          />
        </MessageContext.Provider>
        <button
          onClick={() => {
            enterExitFullscreen();
          }}
        >
          Fullscreen
        </button>
      </div>
      <textarea
        ref={openDocument}
        className="viewitem--item"
        id="viewitem--document"
        value={newDocument}
        onChange={(e) => {
          setNewDocument(e.target.value);
          if (saveButton.current && viewItem.property !== newDocument) {
            saveButton.current.disabled = false;
          }
        }}
        spellCheck={false}
        resize="false"
        disabled={!isEditing}
      />
      {message && <h1 id="document--message">{message}</h1>}
    </div>
  );
}

export default DocumentDisplay;

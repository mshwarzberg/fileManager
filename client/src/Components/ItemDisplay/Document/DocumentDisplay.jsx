import React, { useState, createContext } from "react";
import SaveDocument from "./SaveDocument";

export const MessageContext = createContext();

function DocumentDisplay(props) {
  const { viewItem, enterExitFullscreen, setViewItem, openDocument } = props;

  const [newDocument, setNewDocument] = useState(
    viewItem.property === " " ? "" : viewItem.property
  );

  const [isEditing, setIsEditing] = useState(true);
  const [message, setMessage] = useState();
  
  return (
    <div className="viewitem--block" id="viewitem--block-document">
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
        <MessageContext.Provider value={{ message,setMessage }}>
          <SaveDocument
            setViewItem={setViewItem}
            id=""
            viewItem={viewItem}
            openDocument={openDocument}
            disabled={viewItem.property === newDocument || !newDocument}
            text='Save'
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

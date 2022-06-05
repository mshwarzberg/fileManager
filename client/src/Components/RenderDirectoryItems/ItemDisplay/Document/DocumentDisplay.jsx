import React, { useState, useRef, useEffect } from "react";
import SaveDocument from "../../../Tools/SaveDocument";

function DocumentDisplay(props) {
  const { viewItem, enterExitFullscreen, setViewItem, openDocument } = props;
  const [newDocument, setNewDocument] = useState(
    viewItem.property === " " ? "" : viewItem.property
  );
  useEffect(() => {
    setNewDocument(viewItem.property);
  }, [viewItem.property]);

  const [isEditing, setIsEditing] = useState(true);
  const [message, setMessage] = useState();

  const saveButton = useRef();

  return (
    <div className="viewitem--block" id="document--body">
      <div id="document--header">
        <button
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
        <SaveDocument
          saveButton={saveButton}
          setViewItem={setViewItem}
          viewItem={viewItem}
          openDocumentText={openDocument?.current?.textContent}
          disabled={
            viewItem.property === openDocument?.current?.textContent ||
            !openDocument?.current?.textContent
          }
          text="Save"
          setMessage={setMessage}
        />
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
        id="document"
        value={newDocument}
        onChange={(e) => {
          setNewDocument(e.target.value);
          if (
            saveButton.current &&
            viewItem.property !== openDocument?.current?.textContent
          ) {
            saveButton.current.disabled = false;
          }
        }}
        spellCheck={false}
        resize="false"
        disabled={!isEditing}
      />
      {message && <h1 id="document--message" style={{fontSize: '2rem'}}>{message}</h1>}
    </div>
  );
}

export default DocumentDisplay;

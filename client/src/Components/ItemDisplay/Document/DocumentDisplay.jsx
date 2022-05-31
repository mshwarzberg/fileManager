import React, { useState, useRef, useEffect } from "react";
import SaveDocument from "./SaveDocument";
import useDisplayAnimation from "../../../Hooks/useDisplayAnimation";

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
  useDisplayAnimation(openDocument)

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
        <SaveDocument
          saveButton={saveButton}
          setViewItem={setViewItem}
          id=""
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
        className="viewitem--item loaded"
        id="viewitem--document"
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
      {message && <h1 id="document--message">{message}</h1>}
    </div>
  );
}

export default DocumentDisplay;

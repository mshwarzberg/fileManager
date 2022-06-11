import React, { useState, useRef, useEffect, useContext } from "react";
import DisplayMiscellaneous from "../../../Tools/DisplayMiscellaneous";
import { DirectoryContext } from "../../../Main/App";

function DocumentDisplay(props) {
  const { viewItem, setViewItem, setFullscreen } = props;

  const { state } = useContext(DirectoryContext);
  const [newDocument, setNewDocument] = useState(
    viewItem.property === " " ? "" : viewItem.property
  );
  const [isEdited, setisEdited] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [message, setMessage] = useState({
    msg: "",
    isErr: false,
  });

  const saveButton = useRef();

  useEffect(() => {
    setisEdited(viewItem.property !== newDocument);
  }, [newDocument, setNewDocument, viewItem.property]);

  function saveDocument(keepEditorOpen) {
    fetch("/api/updatedocument", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: state.currentDirectory + "/" + viewItem.name,
        document: newDocument,
      }),
    })
      .then(async (res) => {
        try {
          if (await res.json()) {
            setMessage({
              msg: "Error occured.",
              isErr: true,
            });
            setTimeout(() => {
              setMessage({
                msg: "",
                isErr: null,
              });
            }, 5000);
          }
        } catch {
          setMessage({
            msg: "Successfully Saved!",
            isErr: false,
          });
          setTimeout(() => {
            setMessage({
              msg: "",
              isErr: null,
            });
          }, 5000);
          if (keepEditorOpen) {
            setViewItem({
              ...viewItem,
              property: newDocument,
            });
          }
        }
      })
      .catch(() => {
        setMessage("Error occured.");
        setTimeout(() => {
          setMessage();
        }, 5000);
      });
  }

  return (
    <div className="viewitem--block" id="document--body">
      <DisplayMiscellaneous
        viewItem={viewItem}
        setViewItem={setViewItem}
        setFullscreen={setFullscreen}
        confirmExit={() => {
          if (isEdited) {
            if (
              window.confirm(
                "You have unsaved changes. Are you sure you want to leave?"
              )
            ) {
              saveDocument();
            }
          }
        }}
      />
      <div id="document--header">
        <button
          onClick={(e) => {
            if (isEditing) {
              e.currentTarget.offsetParent.nextSibling.disabled = true;
              return setIsEditing(false);
            } else {
              e.currentTarget.offsetParent.nextSibling.disabled = false;
              setIsEditing(true);
            }
          }}
        >
          {isEditing ? "Lock" : "Edit"}
        </button>
        <button
          onClick={() => {
            if (isEdited) {
              saveDocument(true);
            }
          }}
          disabled={!isEdited}
          ref={saveButton}
        >
          Save
        </button>
      </div>
      <textarea
        className="viewitem--item"
        id="document"
        value={newDocument}
        onChange={(e) => {
          setNewDocument(e.target.value);
        }}
        spellCheck={false}
        resize="false"
        disabled={!isEditing}
      />
      {message.msg && (
        <h1
          id="document--message"
          style={{
            background: message.isErr
              ? "repeating-radial-gradient(red 0%, red 30%, rgba(0, 0, 0, 0) 65%,rgba(0, 0, 0, 0) 100%)"
              : "",
            color: message.isErr ? "white" : "",
          }}
        >
          {message.msg}
        </h1>
      )}
    </div>
  );
}

export default DocumentDisplay;

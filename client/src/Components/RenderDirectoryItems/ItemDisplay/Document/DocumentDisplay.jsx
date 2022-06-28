import React, { useState, useEffect, createContext, useContext } from "react";
import DocumentControls from "./DocumentControls";
import useMouseOrKey from "../../../../Hooks/useMouseOrKey";
import { DirectoryContext } from "../../../Main/App";

export const DocumentContext = createContext();

function DocumentDisplay(props) {
  const { viewItem, setViewItem } = props;
  const { state } = useContext(DirectoryContext);

  const [font, setFont] = useState({});
  const [newDocument, setNewDocument] = useState(viewItem.property);
  const [isEdited, setisEdited] = useState(false);
  const [message, setMessage] = useState({});

  useEffect(() => {
    setisEdited(viewItem.property !== newDocument);
  }, [newDocument, setNewDocument, viewItem.property]);

  useMouseOrKey(
    document.getElementsByClassName("document-page"),
    "keydown",
    "document"
  );

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
            }, 4000);
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
          }, 4000);
          if (keepEditorOpen) {
            setViewItem({
              ...viewItem,
              property: newDocument,
            });
          }
        }
      })
      .catch(() => {
        setMessage({
          msg: "Error occured.",
          isErr: true,
        });
        setTimeout(() => {
          setMessage();
        }, 4000);
      });
  }

  return (
    <DocumentContext.Provider
      value={{ newDocument, setNewDocument, font, setFont }}
    >
      <div className="display--block" id="document--body">
        <DocumentControls
          viewItem={viewItem}
          setViewItem={setViewItem}
          isEdited={isEdited}
          newDocument={newDocument}
          saveDocument={saveDocument}
          message={message}
        />
        <div className="viewitem--item" id="document">
          <textarea
            className="document-page"
            spellCheck={false}
            data-context-menu="true"
            onChange={(e) => {
              setNewDocument(e.target.value);
            }}
            style={{
              fontFamily: font.family,
              fontWeight: font.bold ? "bold" : "",
              fontSize: font.size + "px",
              fontStyle: font.italic ? "italic" : "",
              textDecoration:
                (font.underline ? "underline " : "") +
                (font.strikethrough ? "line-through" : ""),
            }}
            value={newDocument}
          />
        </div>
      </div>
    </DocumentContext.Provider>
  );
}

export default DocumentDisplay;

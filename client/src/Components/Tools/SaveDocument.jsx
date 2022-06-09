import React, { useContext, useEffect } from "react";
import { DirectoryContext } from "../Main/App";

export default function SaveDocument(props) {
  const { state } = useContext(DirectoryContext);

  useEffect(() => {
    if (currentDocumentText && saveButton?.current) {
      document.addEventListener("keydown", (e) => {
        if (e.key === "s" && e.ctrlKey) {
          e.preventDefault();
        }
        if (
          e.key === "s" &&
          e.ctrlKey &&
          viewItem.property !== currentDocumentText
        ) {
          saveDocument();
        }
      });
    }
    return () => {
      document.removeEventListener("keydown", () => {});
    };
  });

  const {
    id,
    currentDocumentText,
    viewItem,
    setConfirmExit,
    setFullscreen,
    disabled,
    setViewItem,
    text,
    saveButton,
    setMessage,
  } = props;

  function saveDocument() {
    fetch("/api/updatedocument", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: state.currentDirectory + "/" + viewItem.name,
        document: currentDocumentText,
      }),
    }).catch(() => {
      if (typeof setMessage === "function") {
        setMessage("Error occured.");
        setTimeout(() => {
          setMessage();
        }, 5000);
      }
    });
    if (
      typeof setConfirmExit === "function" ||
      typeof setFullscreen === "function"
    ) {
      setConfirmExit();
      setFullscreen(false);
      URL.revokeObjectURL(viewItem.property);
      setViewItem({
        property: null,
        name: null,
        index: null,
        type: null,
      });
    } else {
      setMessage("Successfully saved document");
      setViewItem((prevItem) => ({
        ...prevItem,
        property: currentDocumentText,
      }));
      setTimeout(() => {
        setMessage();
      }, 5000);
      saveButton.current.disabled = true;
      setViewItem((prevItem) => ({
        ...prevItem,
        property: currentDocumentText,
      }));
      if (saveButton.current) {
        saveButton.current.disabled = true;
      }
    }
  }

  return (
    <button
      ref={saveButton}
      id={id}
      onClick={() => {
        saveDocument();
      }}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

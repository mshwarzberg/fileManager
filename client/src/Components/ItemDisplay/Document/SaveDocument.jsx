import React, { useContext } from "react";
import { DirectoryStateContext } from "../../../App";

export default function SaveDocument(props) {
  const { state } = useContext(DirectoryStateContext);
     
  const {
    id,
    openDocument,
    viewItem,
    setConfirmExit,
    setFullscreen,
    disabled,
    setViewItem,
    display,
    text,
    newDocument,
    saveButton
  } = props;

  function handleSomething() {
    fetch("/api/updatedocument", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        document: newDocument || openDocument,
        path: state.currentDirectory + "/" + viewItem.name,
      }),
    })
      .then(() => {
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
          setViewItem((prevItem) => ({
            ...prevItem,
            property: openDocument,
          }));
          saveButton.current.disabled = true
        }
      })
      .catch(() => {});
  }
  return (
      <button
        ref={saveButton}
        style={{ display: display }}
        id={id}
        onClick={() => {
          handleSomething()
        }}
        disabled={disabled}
      >
        {text} 
      </button>
  );
}

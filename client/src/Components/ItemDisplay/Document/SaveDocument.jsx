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
    text
  } = props;
  
  return (
    <>
      <button
        style={{display: display}}
        id={id}
        onClick={() => {
          fetch("/api/updatedocument", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              document: openDocument,
              path: state.currentDirectory + "/" + viewItem.name,
            }),
          })
            .then(() => {
              
              if (typeof setConfirmExit === "function" && typeof setFullscreen === 'function') {
                setConfirmExit();
                setFullscreen(false);
                URL.revokeObjectURL(viewItem.property);
              }
              setViewItem({
                property: null,
                name: null,
                index: null,
                type: null,
              })
            })
            .catch(() => {
            });
        }}
        disabled={disabled}
      >
        {text}
      </button>
    </>
  );
}

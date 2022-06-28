import React, { useRef } from "react";
import DisplayMiscellaneous from "../../../Tools/DisplayMiscellaneous";
import ChangeFont from "./ChangeFont";

export default function DocumentControls({
  viewItem,
  setViewItem,
  isEdited,
  saveDocument,
  message,
}) {
  const saveButton = useRef();

  return (
    <div id="document--header">
      <DisplayMiscellaneous
        viewItem={viewItem}
        setViewItem={setViewItem}
        confirmExit={() => {
          if (isEdited) {
            // saveDocument();
          }
        }}
      />
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
      <ChangeFont />
      {message.msg && (
        <h1
          id="document--message"
          style={{
            background: message.isErr
              ? "repeating-radial-gradient(red 0%, red 30%, rgba(0, 0, 0, 0) 65%,rgba(0, 0, 0, 0) 80%, rgba(0, 0, 0, 0) 100%)"
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

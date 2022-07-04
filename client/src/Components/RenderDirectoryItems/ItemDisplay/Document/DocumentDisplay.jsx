import React from "react";
import DisplayMiscellaneous from "../../../Tools/DisplayMiscellaneous";

export default function DocumentDisplay({ viewItem, setViewItem }) {
  function getSelectedText() {
    var selectedText = "";
    let ranges = [];

    if (window.getSelection) {
      selectedText = window.getSelection();
    } else if (document.getSelection) {
      selectedText = document.getSelection();
    } else if (document.selection) {
      selectedText = document.selection.createRange().text;
    } else {
      return;
    }
    const underline = document.createElement("u");
    underline.innerHTML = selectedText;
    if (selectedText.toString()) {
      let doc = document.getElementById("document").innerText;
      for (let i = 0; i < selectedText.rangeCount; i++) {
        ranges[i] = selectedText.getRangeAt(i);
      }
      console.log(doc[ranges[0].startOffset]);
      doc = doc.slice(ranges[0].startOffset, ranges[0].endOffset);

      document.testform.selectedtext.value = selectedText;
    }
  }

  return (
    <div className="display--block" id="document--body">
      <DisplayMiscellaneous
        viewItem={viewItem}
        setViewItem={setViewItem}
        confirmExit={() => {}}
      />
      <div id="document-container">
        <p
          id="document"
          onMouseEnter={() => {
            getSelectedText();
          }}
          spellCheck={false}
          contentEditable
          suppressContentEditableWarning
        >
          {viewItem.property}
        </p>
      </div>
      <form name="testform" style={{ position: "fixed", bottom: 0 }}>
        <textarea name="selectedtext" id="" cols="30" rows="10"></textarea>
      </form>
    </div>
  );
}

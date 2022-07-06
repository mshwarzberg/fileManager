import React from "react";
import DisplayMiscellaneous from "../../../Tools/DisplayMiscellaneous";

export default function DocumentDisplay({ viewItem, setViewItem }) {
  function getSelectedText(index) {
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
      let doc = document.getElementsByClassName("document")[index].innerText;
      for (let i = 0; i < selectedText.rangeCount; i++) {
        ranges[i] = selectedText.getRangeAt(i);
      }

      doc = doc.slice(ranges[0].startOffset, ranges[0].endOffset);
      console.log(doc);
      document.testform.selectedtext.value = selectedText;
    }
  }

  const tempDoc = viewItem.property.split("\n").map((item, i) => {
    return (
      <p
        key={i}
        className="document"
        onMouseMove={() => {
          getSelectedText(i);
        }}
        spellCheck={false}
        contentEditable
        suppressContentEditableWarning
      >
        {item}
      </p>
    );
  });

  return (
    <div className="display--block" id="document--body">
      <DisplayMiscellaneous
        viewItem={viewItem}
        setViewItem={setViewItem}
        confirmExit={() => {}}
      />
      <div id="document-container">{tempDoc}</div>
      <form name="testform" style={{ position: "fixed", bottom: 0 }}>
        <textarea name="selectedtext" id="" cols="30" rows="10"></textarea>
      </form>
    </div>
  );
}

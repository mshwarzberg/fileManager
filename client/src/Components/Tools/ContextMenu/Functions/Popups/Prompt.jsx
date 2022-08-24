import React, { useContext, useEffect } from "react";
import closeIcon from "../../../../../Assets/images/close.png";
import { UIContext } from "../../../GeneralUI";

export default function Prompt() {
  const { setContextMenu, contextMenu, setPopup, popup } =
    useContext(UIContext);
  const originalItem = contextMenu.info;
  const { content, promptFunction } = popup;

  useEffect(() => {
    document.getElementById("prompt-input")?.focus();
    document
      .getElementById("prompt-input")
      ?.setSelectionRange(0, originalItem?.prefix?.length || 1000);
    // eslint-disable-next-line
  }, [popup.type]);

  return (
    <div id="popup-page">
      <div id="popup-body" className="context-menu-item">
        <img
          className="context-menu-item"
          id="close-prompt"
          alt="close"
          src={closeIcon}
          onClick={() => {
            setPopup({});
            setContextMenu({});
          }}
        />
        <input
          type="text"
          spellCheck={false}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (!originalItem.name) {
                promptFunction(content);
              } else if (content && content !== originalItem.name) {
                promptFunction(content, originalItem.path + originalItem.name);
              }
            }
          }}
          id="prompt-input"
          value={content}
          onChange={(e) => {
            setPopup((prevPrompt) => ({
              ...prevPrompt,
              content: e.target.value,
            }));
          }}
          className="context-menu-item"
          wrap="true"
        />
        <button
          className="context-menu-item"
          onClick={() => {
            setPopup({});
            setContextMenu({});
          }}
        >
          Cancel
        </button>
        <button
          className="context-menu-item"
          onClick={() => {
            if (!originalItem.name) {
              promptFunction(content);
            } else if (content && content !== originalItem.name) {
              promptFunction(content, originalItem.path + originalItem.name);
            }
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}

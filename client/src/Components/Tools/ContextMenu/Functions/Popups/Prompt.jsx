import React, { useContext, useEffect } from "react";
import closeIcon from "../../../../../Assets/images/close.png";
import { UIContext } from "../../../GeneralUI";

export default function Prompt() {
  const { setContextMenu, contextMenu, prompt, setPrompt } =
    useContext(UIContext);
  const originalItem = contextMenu.info;
  const { show, content, promptFunction } = prompt;

  useEffect(() => {
    document.getElementById("prompt-input")?.focus();
    document
      .getElementById("prompt-input")
      ?.setSelectionRange(0, originalItem?.prefix?.length || 1000);
    // eslint-disable-next-line
  }, [prompt.show]);

  return (
    show && (
      <div id="popup-page">
        <div id="popup-body" className="context-menu-item">
          <img
            className="context-menu-item"
            id="close-prompt"
            alt="close"
            src={closeIcon}
            onClick={() => {
              setPrompt({});
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
                  promptFunction(
                    content,
                    originalItem.path + originalItem.name
                  );
                }
              }
            }}
            id="prompt-input"
            value={content}
            onChange={(e) => {
              setPrompt((prevPrompt) => ({
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
              setPrompt({});
              setContextMenu({});
            }}
          >
            Cancel
          </button>
          <button
            className="context-menu-item"
            onClick={() => {
              console.log(originalItem);
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
    )
  );
}

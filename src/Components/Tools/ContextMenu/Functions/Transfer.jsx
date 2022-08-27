import React, { useContext } from "react";
import { UIContext } from "../../GeneralUI";
import { GeneralContext } from "../../../Main/App";
import { foundInArrayWithKey } from "../../../../Helpers/SearchArray";
export default function Transfer({ setClipboardData, source, mode }) {
  const { setCornerMessage, setContextMenu } = useContext(UIContext);
  const { itemsSelected } = useContext(GeneralContext);
  return (
    <button
      className="context-menu-item"
      onClick={() => {
        setClipboardData({
          source: source,
          mode: mode,
        });
        setContextMenu({});
        setCornerMessage(
          `${source.length} items ${
            mode === "copy" ? "copied" : "ready to move"
          }`
        );
        setTimeout(() => {
          setCornerMessage();
        }, 3000);
        for (const element of document.getElementsByClassName("cover-block")) {
          if (
            foundInArrayWithKey(
              itemsSelected,
              element.parentElement,
              "element"
            ) &&
            mode === "cut"
          ) {
            element.parentElement.style.opacity = 0.65;
          } else {
            element.parentElement.style.opacity = 1;
          }
        }
      }}
    >
      {mode}
    </button>
  );
}

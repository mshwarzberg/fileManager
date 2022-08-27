import React, { useContext } from "react";
import { UIContext } from "../../../GeneralUI";
import closeIcon from "../../../../../Assets/images/close.png";

export default function Confirm() {
  const { setContextMenu, popup, setPopup } = useContext(UIContext);

  return (
    <div id="popup-page">
      <div className="context-menu-item" id="popup-body">
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
        <h1 id="popup-dialog">{popup.dialog}</h1>
        <button
          className="context-menu-item"
          onClick={() => {
            if (popup.cancelFunction) {
              popup.cancelFunction();
            }
            setPopup({});
            setContextMenu({});
          }}
        >
          {popup.cancelText || "Cancel"}
        </button>
        <button
          className="context-menu-item"
          onClick={() => {
            popup.confirmFunction(true);
            setPopup({});
            setContextMenu({});
          }}
        >
          {popup.confirmText || "OK"}
        </button>
      </div>
    </div>
  );
}

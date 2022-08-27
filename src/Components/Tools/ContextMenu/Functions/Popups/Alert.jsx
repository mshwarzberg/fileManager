import React, { useContext } from "react";
import { UIContext } from "../../../GeneralUI";

export default function Alert() {
  const { setContextMenu, setPopup, popup } = useContext(UIContext);
  return (
    <div id="popup-page">
      <div className="context-menu-item" id="popup-body">
        <h1 id="popup-dialog">{popup.dialog}</h1>
        <button
          className="context-menu-item"
          onClick={() => {
            setPopup({});
            setContextMenu({});
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}

import React, { useContext } from "react";
import { UIContext } from "../../../GeneralUI";
import closeIcon from "../../../../../Assets/images/close.png";

export default function Confirm() {
  const { setContextMenu, contextMenu, confirm, setConfirm } =
    useContext(UIContext);

  return (
    confirm.show && (
      <div id="popup-page">
        <div className="context-menu-item" id="popup-body">
          <img
            className="context-menu-item"
            id="close-prompt"
            alt="close"
            src={closeIcon}
            onClick={() => {
              setConfirm({});
              setContextMenu({});
            }}
          />
          <h1 id="popup-dialog">{confirm.dialog}</h1>
          <button
            className="context-menu-item"
            onClick={() => {
              setConfirm({});
              setContextMenu({});
            }}
          >
            Cancel
          </button>
          <button
            className="context-menu-item"
            onClick={() => {
              confirm.confirmFunction();
              setConfirm({});
              setContextMenu({});
            }}
          >
            OK
          </button>
        </div>
      </div>
    )
  );
}

import React, { useContext } from "react";
import { UIContext } from "../../../GeneralUI";
import closeIcon from "../../../../../Assets/images/close.png";

export default function Confirm() {
  const { setContextMenu, confirm, setConfirm } = useContext(UIContext);

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
              if (confirm.cancelFunction) {
                confirm.cancelFunction();
              }
              setConfirm({});
              setContextMenu({});
            }}
          >
            {confirm.cancelText || "Cancel"}
          </button>
          <button
            className="context-menu-item"
            onClick={() => {
              confirm.confirmFunction(true);
              setConfirm({});
              setContextMenu({});
            }}
          >
            {confirm.confirmText || "OK"}
          </button>
        </div>
      </div>
    )
  );
}

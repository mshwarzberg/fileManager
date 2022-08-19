import React, { useContext } from "react";
import { UIContext } from "../../../GeneralUI";

export default function Alert() {
  const { alert, setAlert, setContextMenu } = useContext(UIContext);
  return (
    alert.show && (
      <div id="popup-page">
        <div className="context-menu-item" id="popup-body">
          <h1 id="popup-dialog">{alert.dialog}</h1>
          <button
            className="context-menu-item"
            onClick={() => {
              setAlert({});
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

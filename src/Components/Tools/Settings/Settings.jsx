import React from "react";
import CloseImage from "../../../Assets/images/close.png";
import Reset from "./Reset";

export default function Settings({ setShowSettings }) {
  return (
    <div id="setttings-page">
      <div
        id="settings-body"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <img
          src={CloseImage}
          alt=""
          onClick={() => {
            setShowSettings(false);
          }}
        />
        <h1>Options</h1>
        <Reset />
      </div>
    </div>
  );
}

import React from "react";

export default function Settings({ setShowSettings }) {
  return (
    <div
      id="setttings-page"
      onClick={() => {
        setShowSettings(false);
      }}
    >
      Settings
    </div>
  );
}

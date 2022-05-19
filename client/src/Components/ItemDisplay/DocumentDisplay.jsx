import React, { useState } from "react";
import useScreenDimensions from "../../Hooks/useScreenDimensions";
import Back from "../../Assets/images/navigate-backwards.png";
import Forward from "../../Assets/images/navigate-forwards.png";

function DocumentDisplay(props) {
  const {
    viewItem,
    fullscreen,
    changeFolderOrViewFiles,
    isNavigating,
    enterExitFullscreen,
  } = props;

  const [editFile, setEditFile] = useState(viewItem.property);
  const { width } = useScreenDimensions();

  return (
    <div className="viewitem--block" id="viewitem--block-document">
      {width < 900 && (
        <>
          <img
            id="button--backwards"
            src={Back}
            alt="back"
            onClick={() => {
              changeFolderOrViewFiles(
                viewItem.type,
                viewItem.name,
                viewItem.index,
                "backwards"
              );
            }}
          />
          <img
            id="button--forwards"
            src={Forward}
            alt="forward"
            onClick={() => {
              changeFolderOrViewFiles(
                viewItem.type,
                viewItem.name,
                viewItem.index,
                "forwards"
              );
            }}
          />
        </>
      )}
      {!fullscreen && isNavigating.visible && (
        <h1
          id="navigating--indicator"
          title={`Press "Tab" to toggle the visibility of this message`}
        >
          {isNavigating.value
            ? `Navigation Enabled: "CapsLock" to disable`
            : `Navigation Disabled: "CapsLock" to enable`}
        </h1>
      )}
      <textarea
        className="viewitem--item"
        id="viewitem--document"
        value={editFile}
        onChange={(e) => {
          setEditFile(e.target.value);
        }}
        onDoubleClick={() => {
          enterExitFullscreen();
        }}
        spellCheck={false}
      />
    </div>
  );
}

export default DocumentDisplay;

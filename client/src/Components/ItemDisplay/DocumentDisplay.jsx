import React, { useState } from "react";
import useScreenDimensions from "../../Hooks/useScreenDimensions";
import Back from "../../Assets/images/navigate-backwards.png";
import Forward from "../../Assets/images/navigate-forwards.png";

function DocumentDisplay(props) {
  const {
    viewItem,
    changeFolderOrViewFiles,
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
        resize={false}
      />
    </div>
  );
}

export default DocumentDisplay;

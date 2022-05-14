import React, { useContext, useState } from "react";
import DisplayHeaderAndClose from "./DisplayHeaderAndClose";
import { DisplayContext } from "../Rendering/RenderFiles";

function DocumentDisplay(props) {
  const { viewItem } = useContext(DisplayContext);
  const [editFile, setEditFile] = useState(viewItem.property);

  return (
    <div className="viewitem--block" id="viewitem--block-document">
      <DisplayHeaderAndClose />
      <textarea
        className="viewitem--item"
        id="viewitem--document"
        value={editFile}
        onChange={(e) => {
          setEditFile(e.target.value);
        }}
        onDoubleClick={() => {
          props.enterExitFullscreen();
        }}
        spellCheck={false}
      />
    </div>
  );
}

export default DocumentDisplay;

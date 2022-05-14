import React, {useContext} from "react";
import DisplayHeaderAndClose from "./DisplayHeaderAndClose";
import { DisplayContext } from "../Rendering/RenderFiles";

function VideoDisplay() {

  const { viewItem } = useContext(DisplayContext)
  
  return (
    <div className="viewitem--block" id="viewitem--block-video">
      <DisplayHeaderAndClose />
      <video
        className="viewitem--item"
        id="viewitem--video"
        src={viewItem.property}
        muted
        controls
      />
    </div>
  );
}

export default VideoDisplay;

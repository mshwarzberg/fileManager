import React, { useContext } from "react";
import { DisplayContext } from "../Rendering/RenderFiles";
import DisplayHeaderAndClose from "./DisplayHeaderAndClose";

function ImageDisplay(props) {
  const { viewItem, fullscreen } = useContext(DisplayContext)

  return (
    <div className="viewitem--block">
      <DisplayHeaderAndClose />
      <img
      onDoubleClick={() =>  {
        props.enterExitFullscreen()
      }}
        id={fullscreen ? 'image-fullscreen' : ''}
        className="viewitem--item"
        src={viewItem.property}
        alt={viewItem.name}
      />
    </div>
  );
}

export default ImageDisplay;

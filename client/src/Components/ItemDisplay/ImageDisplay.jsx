import React, { useContext } from "react";
import { DisplayContext } from "../Rendering/RenderFiles";
import DisplayHeaderAndClose from "./DisplayHeaderAndClose";
import useScreenDimensions from "../../Hooks/useScreenDimensions";
import Back from "../../Assets/images/navigate-backwards.png";
import Forward from "../../Assets/images/navigate-forwards.png";

function ImageDisplay(props) {
  const { viewItem, fullscreen } =
    useContext(DisplayContext);

  const { width } = useScreenDimensions();

  return (
    <div className="viewitem--block">
      {width < 800 && (
        <div>
          <img
            id="button--backwards"
            src={Back}
            alt="back"
            onClick={() => {
              props.changeFolderOrViewFiles(
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
              props.changeFolderOrViewFiles(
                viewItem.type,
                viewItem.name,
                viewItem.index,
                "forwards"
              );
            }}
          />
        </div>
      )}
      <DisplayHeaderAndClose />
      <img
        onDoubleClick={() => {
          props.enterExitFullscreen();
        }}
        id={fullscreen ? "image-fullscreen" : ""}
        className="viewitem--item"
        src={viewItem.property}
        alt={viewItem.name}
      />
    </div>
  );
}

export default ImageDisplay;

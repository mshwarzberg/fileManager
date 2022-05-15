import React, {useContext} from "react";
import Close from '../../Assets/images/close.png'
import { DisplayContext } from "../Rendering/RenderFiles";

export default function DisplayHeaderAndClose() {
  
  const {fullscreen, viewItem, setViewItem, setFullscreen} = useContext(DisplayContext)

  return (
    <>
      {!fullscreen && <h1 id="viewitem--filename">{viewItem.name}</h1>}
      <img
        src={Close}
        alt=""
        className="viewitem--close"
        onClick={() => {
          setFullscreen(false)
          URL.revokeObjectURL(viewItem.property);
          setViewItem({
            type: null,
            property: null,
            index: null,
            name: null,
          });
        }}
      />
    </>
  );
}

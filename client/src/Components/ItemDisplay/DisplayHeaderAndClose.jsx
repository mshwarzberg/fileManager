import React from "react";
import Close from '../../Assets/images/close.png'

export default function DisplayHeaderAndClose(props) {
  
  const {fullscreen, viewItem, setViewItem, setFullscreen} = props

  return (
    <>
      {!fullscreen && <h1 id="viewitem--filename">{viewItem.name}</h1>}
      <img
        src={Close}
        alt="close"
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

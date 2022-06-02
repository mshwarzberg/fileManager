import React, { useRef, useState } from "react";
import VideoDisplay from "./Video/VideoDisplay";
import DocumentDisplay from "./Document/DocumentDisplay";
import ImageDisplay from "./Image/ImageDisplay";
import DisplayMiscellaneous from "../../Tools/DisplayMiscellaneous";

export default function ItemDisplay({
  viewItem,
  setViewItem,
  isNavigating,
  changeFolderOrViewFiles,
}) {
  const [fullscreen, setFullscreen] = useState(false);

  function enterExitFullscreen() {
    const item = document.querySelector("#fullscreen");
    if (document.fullscreenElement == null) {
      item.requestFullscreen();
      setFullscreen(true);
    } else {
      setFullscreen(false);
      document.exitFullscreen();
    }
  }

  const openDocument = useRef();

  return (
    viewItem.property && (
      <div id="fullscreen">
        {viewItem.type === "video" && <VideoDisplay viewItem={viewItem} />}
        {viewItem.type === "document" && (
          <DocumentDisplay
            setViewItem={setViewItem}
            enterExitFullscreen={enterExitFullscreen}
            viewItem={viewItem}
            openDocument={openDocument}
          />
        )}
        {viewItem.type === "imagegif" && (
          <ImageDisplay
            enterExitFullscreen={enterExitFullscreen}
            fullscreen={fullscreen}
            viewItem={viewItem}
          />
        )}
        <DisplayMiscellaneous
          fullscreen={fullscreen}
          viewItem={viewItem}
          setViewItem={setViewItem}
          setFullscreen={setFullscreen}
          isNavigating={isNavigating}
          changeFolderOrViewFiles={changeFolderOrViewFiles}
          openDocument={openDocument.current}
        />
      </div>
    )
  );
}

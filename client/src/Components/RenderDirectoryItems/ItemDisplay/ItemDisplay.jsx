import React, { useState } from "react";
import VideoDisplay from "./Video/VideoDisplay";
import DocumentDisplay from "./Document/DocumentDisplay";
import ImageDisplay from "./Image/ImageDisplay";
import DisplayMiscellaneous from "../../Tools/DisplayMiscellaneous";

export default function ItemDisplay({
  viewItem,
  setViewItem,
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

  return (
    viewItem.property && (
      <div id="fullscreen">
        {viewItem.type === "video" && (
          <VideoDisplay viewItem={viewItem}>
            <DisplayMiscellaneous
              viewItem={viewItem}
              setViewItem={setViewItem}
              changeFolderOrViewFiles={changeFolderOrViewFiles}
              setFullscreen={setFullscreen}
            />
          </VideoDisplay>
        )}
        {viewItem.type === "document" && (
          <DocumentDisplay
            setViewItem={setViewItem}
            enterExitFullscreen={enterExitFullscreen}
            viewItem={viewItem}
            setFullscreen={setFullscreen}
          />
        )}
        {viewItem.type === "imagegif" && (
          <ImageDisplay
            enterExitFullscreen={enterExitFullscreen}
            fullscreen={fullscreen}
            viewItem={viewItem}
            setViewItem={setViewItem}
            setFullscreen={setFullscreen}
          />
        )}
      </div>
    )
  );
}

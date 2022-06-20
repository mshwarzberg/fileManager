import React from "react";
import VideoDisplay from "./Video/VideoDisplay";
import DocumentDisplay from "./Document/DocumentDisplay";
import ImageDisplay from "./Image/ImageDisplay";
import DisplayMiscellaneous from "../../Tools/DisplayMiscellaneous";
export default function ItemDisplay({ viewItem, setViewItem }) {
  return (
    viewItem.property && (
      <div id="fullscreen">
        {viewItem.type === "video" && (
          <VideoDisplay viewItem={viewItem}>
            <DisplayMiscellaneous
              viewItem={viewItem}
              setViewItem={setViewItem}
            />
          </VideoDisplay>
        )}
        {viewItem.type === "document" && (
          <DocumentDisplay setViewItem={setViewItem} viewItem={viewItem} />
        )}
        {viewItem.type === "imagegif" && (
          <ImageDisplay viewItem={viewItem} setViewItem={setViewItem} />
        )}
      </div>
    )
  );
}

import React, { useEffect, useState, useRef } from "react";

// component import
import ImageGif from "./RenderIconsAndThumbnails/ImageGif";
import Video from "./RenderIconsAndThumbnails/Video";
import Icon from "./RenderIconsAndThumbnails/Icon";

import VideoDisplay from "../ItemDisplay/Video/VideoDisplay";
import DocumentDisplay from "../ItemDisplay/DocumentDisplay";
import ImageDisplay from "../ItemDisplay/ImageDisplay";
import DisplayHeaderAndClose from "../ItemDisplay/DisplayHeaderAndClose";

import Scrollbar from "../../Components/General/Scrollbar";
import useShowScrollbar from "../../Hooks/useShowScrollbar";

function RenderFiles(props) {
  const { directoryItems } = props;

  const [viewItem, setViewItem] = useState({
    type: null,
    property: null,
    index: null,
    name: null,
  });

  const [isNavigating, setIsNavigating] = useState({
    value: true,
    visible: true,
  });

  const [fullscreen, setFullscreen] = useState(false);

  const renderPage = useRef();
  const { showScrollbar } = useShowScrollbar(renderPage.current);

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

  useEffect(() => {
    function navigateImagesAndVideos(e) {
      if (e.key === "CapsLock") {
        setIsNavigating({
          value: !isNavigating.value,
          visible: isNavigating.visible,
        });
      }
      if (e.key === "Tab") {
        setIsNavigating({
          value: isNavigating.value,
          visible: !isNavigating.visible,
        });
      }
      if (viewItem.property) {
        let direction;
        if (e.key === "ArrowRight" && isNavigating.value) {
          direction = "forwards";
        }
        if (e.key === "ArrowLeft" && isNavigating.value) {
          direction = "backwards";
        }
        changeFolderOrViewFiles(
          viewItem.type,
          viewItem.name,
          viewItem.index,
          direction
        );
      }
    }
    document.addEventListener("keydown", navigateImagesAndVideos);
    return () => {
      document.removeEventListener("keydown", navigateImagesAndVideos);
    };
  });

  function renderViewItem(type, property, index, filename) {
    if (type === "video") {
      return setViewItem({
        type: "video",
        property: property,
        index: index,
        name: filename,
      });
    } else if (type === "image" || type === "gif" || type === "document") {
      fetch(`/api/loadfiles/file`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: filename,
          type: type,
        }),
      })
        .then(async (res) => {
          const response = await res.blob();

          if (res.headers.get("type") === "imagegif") {
            const imageURL = URL.createObjectURL(response);
            return setViewItem({
              type: "imagegif",
              property: imageURL,
              index: index,
              name: filename,
            });
          } else {
            const reader = new FileReader();
            reader.onload = function () {
              setViewItem({
                type: "document",
                property: reader.result,
                index: index,
                name: filename,
              });
            };
            reader.readAsBinaryString(response);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function changeFolderOrViewFiles(type, filename, index, direction) {
    // arrow functionality to navigate through the files while item is displayed
    if (direction) {
      if (direction === "forwards") {
        for (let i = index + 1; i < directoryItems.length - 1; i++) {
          type = directoryItems[i].itemtype;
          if (type === "video" || type === "image" || type === "document") {
            filename = directoryItems[i].name;
            index = i;
            break;
          }
        }
      } else if (direction === "backwards") {
        for (let i = index - 1; i > 0; i--) {
          type = directoryItems[i].itemtype;
          if (type === "video" || type === "image" || type === "document") {
            filename = directoryItems[i].name;
            index = i;
            break;
          }
        }
      }
    }
    if (type !== "folder") {
      // setting a 'default' property since the video is the only property that will not use fetch. If the type is not video the property will be overridden later on.
      return renderViewItem(
        type,
        `/api/loadfiles/playvideo/${filename}`,
        index,
        filename
      );
    }
  }

  // render the file data and thumbnails
  const renderItems = directoryItems?.map((item) => {
    const { name, fileextension, size } = item;
    if (name) {
      return (
        <div key={`Name: ${name}\nSize: ${size}\nType: ${fileextension}`}>
          <ImageGif
            directoryItems={directoryItems}
            changeFolderOrViewFiles={changeFolderOrViewFiles}
            item={item}
          />
          <Video
            directoryItems={directoryItems}
            changeFolderOrViewFiles={changeFolderOrViewFiles}
            item={item}
          />
          <Icon
            directoryItems={directoryItems}
            changeFolderOrViewFiles={changeFolderOrViewFiles}
            item={item}
          />
        </div>
      );
    }
    return "";
  });
  return (
    <div id="renderfile--page" ref={renderPage}>
      {showScrollbar && <Scrollbar />}
      {renderItems}
      {viewItem.property && (
        <>
          <div id="fullscreen">
            {viewItem.type === "video" && (
              <>
                <DisplayHeaderAndClose
                  fullscreen={fullscreen}
                  viewItem={viewItem}
                  setViewItem={setViewItem}
                  setFullscreen={setFullscreen}
                  isNavigating={isNavigating}
                />
                <VideoDisplay
                  enterExitFullscreen={enterExitFullscreen}
                  changeFolderOrViewFiles={changeFolderOrViewFiles}
                  isNavigating={isNavigating}
                  fullscreen={fullscreen}
                  setFullscreen={setFullscreen}
                  viewItem={viewItem}
                  setViewItem={setViewItem}
                />
              </>
            )}
            {viewItem.type === "document" && (
              <>
                <DisplayHeaderAndClose
                  isNavigating={isNavigating}
                  fullscreen={fullscreen}
                  viewItem={viewItem}
                  setViewItem={setViewItem}
                  setFullscreen={setFullscreen}
                />
                <DocumentDisplay
                  enterExitFullscreen={enterExitFullscreen}
                  changeFolderOrViewFiles={changeFolderOrViewFiles}
                  isNavigating={isNavigating}
                  fullscreen={fullscreen}
                  setFullscreen={setFullscreen}
                  viewItem={viewItem}
                  setViewItem={setViewItem}
                />
              </>
            )}
            {viewItem.type === "imagegif" && (
              <>
                <DisplayHeaderAndClose
                  fullscreen={fullscreen}
                  viewItem={viewItem}
                  setViewItem={setViewItem}
                  setFullscreen={setFullscreen}
                  isNavigating={isNavigating}
                />
                <ImageDisplay
                  enterExitFullscreen={enterExitFullscreen}
                  changeFolderOrViewFiles={changeFolderOrViewFiles}
                  fullscreen={fullscreen}
                  viewItem={viewItem}
                />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default RenderFiles;

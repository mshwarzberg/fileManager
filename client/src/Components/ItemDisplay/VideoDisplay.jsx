import React, { useState, useEffect, useRef } from "react";
import back from "../../Assets/images/navigate-backwards.png";
import forward from "../../Assets/images/navigate-forwards.png";
import useScreenDimensions from "../../Hooks/useScreenDimensions";
import VideoControls from "./VideoControls";
import alerticon from "../../Assets/images/alert.png";

function VideoDisplay(props) {
  const { viewItem, fullscreen, changeFolderOrViewFiles, isNavigating } = props;
  const { height: screenHeight, width: screenWidth } = useScreenDimensions();
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });

  const videoPage = useRef();
  const video = useRef();
  const videoContainer = useRef();

  //  video states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHideOverlay, setShowHideOverlay] = useState({
    mouseMoving: false,
    forceShowOverlay: true,
  });

  function showHideHeaderControls() {
    if (!containerDimensions.width || !containerDimensions.height) {
      return false;
    }
    if (!isPlaying) {
      return true;
    }
    if (showHideOverlay.mouseMoving) {
      return true;
    }
  }

  function fitVideo() {
    if (video.current) {
      const videoHeight = video.current.videoHeight;
      const videoWidth = video.current.videoWidth;
      const scaledHeight = (screenHeight * 96) / 100;
      const scaledWidth = (screenWidth * 96) / 100;
      let containerWidth = videoContainer.current.style.width;
      let containerHeight = videoContainer.current.style.height;

      if (
        containerHeight !== screenHeight &&
        containerHeight !== videoHeight &&
        containerWidth !== screenWidth &&
        containerWidth !== videoWidth
      ) {
        const larger = Math.max(videoWidth, videoHeight);
        const smaller = Math.min(videoWidth, videoHeight);
        // ratio of video is greater or equal to the screens ratio. (taller or wider)
        if (larger / smaller >= screenWidth / screenHeight) {
          // vertical video
          if (larger === videoHeight) {
            let newWidth = (scaledHeight * smaller) / larger;
            // if the scaled video width fits within the screen
            if (newWidth < scaledWidth) {
              return setContainerDimensions({
                width: newWidth,
                height: scaledHeight,
              });
              // if the new video's container is wider than the screen scale down to the screen
            } else if (newWidth > scaledWidth) {
              let newHeight = (scaledWidth * larger) / smaller;

              return setContainerDimensions({
                width: scaledWidth,
                height: newHeight,
              });
            }
            // horizontal video.
          } else if (larger === videoWidth) {
            let newHeight = (scaledWidth / larger) * smaller;

            return setContainerDimensions({
              width: scaledWidth,
              height: newHeight,
            });
          }
          // ratio of screen is greater or equal than the ratio of the video
        } else if (larger / smaller <= screenWidth / screenHeight) {
          // vertical video
          if (larger === videoHeight) {
            let newWidth = (scaledHeight * smaller) / larger;
            return setContainerDimensions({
              width: newWidth,
              height: scaledHeight,
            });
            // horizontal video
          } else if (larger === videoWidth) {
            let newWidth = (scaledHeight / smaller) * larger;

            return setContainerDimensions({
              height: scaledHeight,
              width: newWidth,
            });
          }
        }
      }
    }
  }

  useEffect(() => {
    let timer;
    if (showHideOverlay.mouseMoving && !showHideOverlay.forceShowOverlay && isPlaying) {
      timer = setTimeout(() => {
        setShowHideOverlay({
          mouseMoving: false,
          forceShowOverlay: true,
        });
          videoContainer.current.style.cursor = "none";
      }, 3000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [showHideOverlay]);

  return (
    <div className="viewitem--block" id="viewitem--block-video" ref={videoPage}>
      {screenWidth < 800 && (
        <>
          <img
            id="button--backwards"
            src={back}
            alt="back"
            onClick={() => {
              changeFolderOrViewFiles(
                viewItem.type,
                viewItem.name,
                viewItem.index,
                "backwards"
              );
            }}
          />
          <img
            id="button--forwards"
            src={forward}
            alt="forward"
            onClick={() => {
              changeFolderOrViewFiles(
                viewItem.type,
                viewItem.name,
                viewItem.index,
                "forwards"
              );
            }}
          />
        </>
      )}
      {!fullscreen && isNavigating.visible && (
        <div id="navigating-indicator">
          <img
            src={alerticon}
            alt=""
            title={`Press "Tab" to toggle the visibility of this message`}
          />
          <h1 id="navigating-indicator-popup">
            {isNavigating.value
              ? `Navigation Enabled: "CapsLock" to disable`
              : `Navigation Disabled: "CapsLock" to enable`}
          </h1>
        </div>
      )}
      <div
        id="video-container"
        onMouseMove={(e) => {
          if (
            containerDimensions.width !== video.current.videoWidth ||
            containerDimensions.height !== video.current.videoHeight
          ) {
            fitVideo();
          }
          setShowHideOverlay({
            mouseMoving: true,
            forceShowOverlay: showHideOverlay.forceShowOverlay,
          });
          videoContainer.current.style.cursor = "default";
          e.stopPropagation();
        }}
        onMouseLeave={() => {
          setShowHideOverlay({
            mouseMoving: false,
            forceShowOverlay: false,
          });
        }}
        onClick={() => {
          if (video.current.paused) {
            video.current.play();
            setIsPlaying(true);
          } else {
            video.current.pause();
            return setIsPlaying(false);
          }
          return;
        }}
        ref={videoContainer}
        onDoubleClick={() => {
          if (document.fullscreenElement == null) {
            videoContainer.current.requestFullscreen();
            setIsFullscreen(true);
          } else {
            document.exitFullscreen();
            setIsFullscreen(false);
          }
        }}
        style={{
          width: containerDimensions.width,
          height: containerDimensions.height,
        }}
      >
        {showHideHeaderControls() && (
          <>
            <div
              id="video-header"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {viewItem.name}
            </div>
            <VideoControls
              setShowHideOverlay={setShowHideOverlay}
              videoPage={videoPage.current}
              video={video.current}
              videoContainer={videoContainer.current}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              isFullscreen={isFullscreen}
              setIsFullscreen={setIsFullscreen}
            />
          </>
        )}
        <video
          onCanPlay={() => {
            fitVideo();
          }}
          ref={video}
          className="viewitem--item"
          id="viewitem--video"
          src={viewItem.property}
          on
        />
      </div>
    </div>
  );
}

export default VideoDisplay;

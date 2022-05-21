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
    width: (screenWidth * 96) / 100,
    height: (screenHeight * 96) / 100,
  });

  function fitVideo(video, videoContainer) {
    video.current.volume = 0;

    const videoHeight = video.current.videoHeight;
    const videoWidth = video.current.videoWidth;
    let containerWidth = videoContainer.current.style.width;
    let containerHeight = videoContainer.current.style.height;

    if (
      containerHeight !== screenHeight &&
      containerHeight !== videoHeight &&
      containerWidth !== screenWidth &&
      containerWidth !== videoWidth
    ) {
      // contain the video within the screen
      if (videoHeight > screenHeight || videoWidth > screenWidth) {
        // contain the video's height within the screen's vertical while keeping the ratio
        if (screenHeight < videoHeight) {
          let newHeight = (screenHeight * 96) / 100;
          return setContainerDimensions({
            width: (newHeight / videoHeight) * videoWidth,
            height: newHeight,
          });
          // contain the video's width within the screen's horizontal while keeping the ratio
        } else if (screenWidth < videoWidth) {
          let newWidth = (screenWidth * 96) / 100;
          return setContainerDimensions({
            width: newWidth,
            height: (newWidth / videoWidth) * videoHeight,
          });
        }
        // expand the video to fit the screen
      } else if (videoHeight <= screenHeight || videoWidth <= screenWidth) {
        // expand the video's width to match 96% of the screen's width and keep the ratio
        if (
          videoHeight < videoWidth
        ) {
          let newWidth = (screenWidth * 96) / 100;
          return setContainerDimensions({
            width: newWidth,
            height: (videoHeight * newWidth) / videoWidth,
          });
          // expand the video's height to match 96% of the screen's height and keep the ratio
        } else if (
          videoHeight > videoWidth
        ) {
          let newHeight = (screenHeight * 96) / 100;
          return setContainerDimensions({
            width: (videoWidth * newHeight) / videoHeight,
            height: newHeight,
          });
        }
      }
    }
  }
  const videoPage = useRef();
  const video = useRef();
  const videoContainer = useRef();

  //  video states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    fitVideo(video, videoContainer);
  }, [screenHeight, screenWidth]);

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
        onClick={() => {
          if (video.current.paused) {
            video.current.play();
            setIsPlaying(true);
          } else {
            video.current.pause();
            setIsPlaying(false);
          }
        }}
        ref={videoContainer}
        onDoubleClick={() => {
          if (document.fullscreenElement == null) {
            videoPage.current.classList.remove("mini-player");
            videoContainer.current.requestFullscreen();
            setIsFullscreen(true);
          } else {
            document.exitFullscreen();
            setIsFullscreen(false);
          }
        }}
        id="video-container"
        data-volume-level="high"
        style={{
          width: containerDimensions.width,
          height: containerDimensions.height,
        }}
      >
        {containerDimensions.width && containerDimensions.height && (
          <VideoControls
            videoPage={videoPage.current}
            video={video.current}
            videoContainer={videoContainer.current}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            isFullscreen={isFullscreen}
            setIsFullscreen={setIsFullscreen}
          />
        )}
        <video
          ref={video}
          className="viewitem--item"
          id="viewitem--video"
          src={viewItem.property}
        />
      </div>
    </div>
  );
}

export default VideoDisplay;

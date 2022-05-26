import React, { useRef } from "react";
import back from "../../../Assets/images/navigate-backwards.png";
import forward from "../../../Assets/images/navigate-forwards.png";
import useScreenDimensions from "../../../Hooks/useScreenDimensions";
import VideoControls from "./VideoControls";
import alerticon from "../../../Assets/images/alert.png";
import useFitVideo from '../../../Hooks/useFitVideo'

let timeouts

function VideoDisplay(props) {
  const { viewItem, fullscreen, changeFolderOrViewFiles, isNavigating } = props;
  const { width: screenWidth } = useScreenDimensions();

  const {fitVideo, containerDimensions} = useFitVideo()

  const video = useRef();
  const videoContainer = useRef();
  const videoControls = useRef()
  const videoHeader = useRef()

  function togglePlay() {
    if (video.current.paused) {
      video.current.play();
    } else {
      video.current.pause();
      videoControls.current.style.display = 'block'
      videoContainer.current.style.cursor = "default";
      videoHeader.current.style.display = 'block'
    }
  }

  return (
    <div className="viewitem--block" id="viewitem--block-video">
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
        onKeyDown={(e) => {
          console.log(e.key)
          if (e.key === " ") {
            togglePlay()
          }
          if (e.key === 'ArrowLeft'){
            video.current.currentTime -= 5
          }
          if (e.key === 'ArrowRight'){
            video.current.currentTime += 5
          }
          if (e.key === 'f') {
            if (document.fullscreenElement) {
              document.exitFullscreen()
            } else {
              return videoContainer.current.requestFullscreen()
            }
          }
          e.stopPropagation()
        }}
        onMouseMove={(e) => {
          clearTimeout(timeouts)

          if (videoControls.current) {
            videoControls.current.style.display = 'block'
            videoContainer.current.style.cursor = "default";
            videoHeader.current.style.display = 'block'
          }
          if (
            containerDimensions.width !== video.current.videoWidth ||
            containerDimensions.height !== video.current.videoHeight
            ) {
              fitVideo(video.current, videoContainer.current);
            }
            if (e.target.id !== 'viewitem--video') {
              return
            }
            if (!video.current.paused && videoControls.current && videoHeader.current) {
              timeouts = setTimeout(() => {
                if (!videoContainer.current) {
                  return
                }
                videoContainer.current.style.cursor = "none";
                videoControls.current.style.display = 'none'
                videoHeader.current.style.display = 'none'
              }, 2000)
            }
          e.stopPropagation();
        }}
        onMouseLeave={() => {
          if (videoControls.current && !video.current.paused && videoHeader.current) {
            videoControls.current.style.display = 'none'
            videoHeader.current.style.display = 'none'
          }
        }}
        onClick={() => {
          togglePlay()
        }}
        ref={videoContainer}
        onDoubleClick={() => {
          if (document.fullscreenElement == null) {
            videoContainer.current.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
        }}
        style={{
          width: containerDimensions.width,
          height: containerDimensions.height,
        }}
      >
        {containerDimensions.width && containerDimensions.height && (
          <>
            <svg id="video-header" viewBox="0 0 25 25" ref={videoHeader}>
              <text fill="currentColor" y="15" x='10' id="video-header-filename">
                {viewItem.name}
              </text>
            </svg>
            <VideoControls
              togglePlay={togglePlay}
              videoControls={videoControls}
              video={video.current}
              videoContainer={videoContainer.current}
            />
          </>
        )}
        <video
          onCanPlay={() => {
            if (!containerDimensions.width && !containerDimensions.height) {
              video.current.volume = 0
            }
            fitVideo(video.current, videoContainer.current);
          }}
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

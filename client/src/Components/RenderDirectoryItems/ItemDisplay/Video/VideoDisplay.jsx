import React, { useRef, useState } from "react";
import VideoControls from "./VideoControls";
import useFitVideo from "../../../../Hooks/useFitVideo";
import useDrag from "../../../../Hooks/useDrag";

let timeouts;

function VideoDisplay(props) {
  const { viewItem } = props;

  const { fitVideo, containerDimensions } = useFitVideo();

  const video = useRef();
  const videoContainer = useRef();
  const videoControls = useRef();
  const videoHeader = useRef();
  const videoPage = useRef();

  const { setIsDragging, onMouseMove } = useDrag(videoPage.current);

  function togglePlay() {
    if (video.current.paused) {
      video.current.play();
    } else {
      video.current.pause();
      videoControls.current.style.display = "block";
      videoContainer.current.style.cursor = "default";
      videoHeader.current.style.display = "block";
    }
  }

  const [miniPlayer, setMiniPlayer] = useState(false);

  return (
    <div
      className={
        miniPlayer ? "viewitem--block mini-player-body" : "viewitem--block"
      }
      id="viewitem--block-video"
      ref={videoPage}
      onMouseDown={(e) => {
        if (miniPlayer && !document.fullscreenElement) {
          setIsDragging(true);
        }
        e.stopPropagation();
      }}
      onMouseUp={(e) => {
        setIsDragging(false);
        document.removeEventListener("mousemove", onMouseMove);
        e.stopPropagation();
      }}
    >
      {props.children}
      <div
        className={miniPlayer ? "viewitem--item mini-player" : "viewitem--item"}
        id="video-container"
        onMouseMove={(e) => {
          clearTimeout(timeouts);
          if (videoControls.current) {
            videoControls.current.style.display = "block";
            videoContainer.current.style.cursor = "default";
            videoHeader.current.style.display = "block";
          }
          if (
            containerDimensions.width !== video.current.videoWidth ||
            containerDimensions.height !== video.current.videoHeight
          ) {
            fitVideo(video.current, videoContainer.current);
          }
          if (e.target.id !== "viewitem--video") {
            return;
          }
          if (
            !video.current.paused &&
            videoControls.current &&
            videoHeader.current
          ) {
            timeouts = setTimeout(() => {
              if (!videoContainer.current) {
                return;
              }
              videoContainer.current.style.cursor = "none";
              videoControls.current.style.display = "none";
              videoHeader.current.style.display = "none";
            }, 2000);
          }
          e.stopPropagation();
        }}
        onMouseLeave={() => {
          if (
            videoControls.current &&
            !video.current.paused &&
            videoHeader.current
          ) {
            videoControls.current.style.display = "none";
            videoHeader.current.style.display = "none";
          }
        }}
        onClick={() => {
          togglePlay();
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
          width: miniPlayer
            ? containerDimensions.width / 2.5
            : containerDimensions.width,
          height: miniPlayer
            ? containerDimensions.height / 2.5
            : containerDimensions.height,
        }}
      >
        {containerDimensions.width && containerDimensions.height && (
          <>
            <svg
              id="video-header"
              viewBox="0 0 25 25"
              ref={videoHeader}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <text
                fill="currentColor"
                y="15"
                x="10"
                id="video-header-filename"
              >
                {viewItem.name}
              </text>
            </svg>
            <VideoControls
              togglePlay={togglePlay}
              videoControls={videoControls}
              video={video.current}
              videoContainer={videoContainer.current}
              setMiniPlayer={setMiniPlayer}
              miniPlayer={miniPlayer}
              videoPage={videoPage.current}
            />
          </>
        )}
        <video
          onCanPlay={() => {
            if (!containerDimensions.width && !containerDimensions.height) {
              video.current.volume = 0;
            }
            fitVideo(video.current, videoContainer.current);
          }}
          ref={video}
          id="viewitem--video"
          src={`/api/loadfiles/playvideo/${viewItem.property}`}
        />
      </div>
    </div>
  );
}

export default VideoDisplay;

import React, { useRef, useState, useEffect } from "react";
import VideoControls from "./VideoControls";
import useFitVideo from "../../../../Hooks/useFitVideo";
import useFullscreenElement from "../../../../Hooks/useFullscreenElement";

import { expand } from "../../../../Assets/images/videocontrols/index.js";
import DisplayMiscellaneous from "../../../Tools/DisplayMiscellaneous";
import useMouseOrKey from "../../../../Hooks/useMouseOrKey";

let timeouts;
function VideoDisplay(props) {
  const { viewItem, setViewItem } = props;

  const video = useRef();
  const videoContainer = useRef();
  const videoControls = useRef();
  const videoHeader = useRef();
  const videoPage = useRef();

  const [miniPlayer, setMiniPlayer] = useState(false);
  const [looping, setLooping] = useState(false);

  useMouseOrKey(video.current, "keydown", "video", videoContainer.current, [
    miniPlayer,
    setMiniPlayer,
    looping,
    setLooping,
  ]);

  const { fullscreenControl, fullscreen } = useFullscreenElement(
    videoContainer.current
  );
  const { fitVideo, containerDimensions } = useFitVideo();

  function togglePlay() {
    if (video.current.paused) {
      video.current.play();
    } else {
      video.current.pause();
    }
  }

  function showHideHeaderControls(isShowing) {
    videoContainer.current.style.cursor = isShowing ? "default" : "none";
    videoControls.current.style.transform =
      videoHeader.current.style.transform = `scaleY(${isShowing ? 1 : 0})`;

    videoControls.current.style.transformOrigin = "bottom";
    videoHeader.current.style.transformOrigin = "top";

    videoControls.current.style.transition =
      videoHeader.current.style.transition = "transform 150ms ease-in-out";
  }

  return (
    <div
      className={
        miniPlayer ? "display--block mini-player-body" : "display--block"
      }
      id="display--block-video"
      ref={videoPage}
      onWheel={(e) => {
        if (e.deltaY < 0) {
          video.current.volume <= 0.97
            ? (video.current.volume += 0.03)
            : (video.current.volume = 1);
        } else {
          video.current.volume >= 0.03
            ? (video.current.volume -= 0.03)
            : (video.current.volume = 0);
        }
      }}
    >
      {!miniPlayer && (
        <DisplayMiscellaneous
          viewItem={viewItem}
          setViewItem={setViewItem}
          element={video.current}
        />
      )}
      <div
        className={miniPlayer ? "viewitem--item mini-player" : "viewitem--item"}
        id="video-container"
        onMouseMove={(e) => {
          clearTimeout(timeouts);
          if (videoControls.current) {
            showHideHeaderControls(true);
          }
          if (
            containerDimensions.width !== video.current.videoWidth ||
            containerDimensions.height !== video.current.videoHeight
          ) {
            fitVideo(video.current, videoContainer.current);
          }
          // If a user is hovering over the header or video controls don't hide the cursor and other stuff
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
              showHideHeaderControls(false);
            }, 1000);
          }
        }}
        onMouseLeave={() => {
          if (
            videoControls.current &&
            !video.current.paused &&
            videoHeader.current
          ) {
            showHideHeaderControls(false);
          }
        }}
        onClick={() => {
          togglePlay();
        }}
        onDoubleClick={() => {
          fullscreenControl();
          if (!fullscreen) {
            setMiniPlayer(false);
            videoPage.current.style.left = videoPage.current.style.top = "";
          }
        }}
        ref={videoContainer}
        style={{
          width: miniPlayer
            ? containerDimensions.width / 2.5
            : containerDimensions.width,
          height: miniPlayer
            ? containerDimensions.height / 2.5
            : containerDimensions.height,
        }}
      >
        {containerDimensions.width &&
        containerDimensions.height &&
        !miniPlayer ? (
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
              looping={looping}
              setLooping={setLooping}
            />
          </>
        ) : (
          <>
            <img
              src={expand}
              onClick={(e) => {
                setMiniPlayer(false);
                videoPage.current.style.left = videoPage.current.style.top = "";
                e.stopPropagation();
              }}
              alt="expand"
              style={{
                width: "6%",
                position: "absolute",
                left: "0.5rem",
                top: "0.5rem",
                cursor: "pointer",
              }}
            />
            <div
              style={{
                width: "3%",
                height: "3%",
                backgroundColor: "red",
                position: "absolute",
                cursor: "grab",
                top: "1%",
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
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

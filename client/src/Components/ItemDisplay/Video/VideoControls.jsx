import React, { useEffect, useState, useRef } from "react";
import formatDuration from "../../../Helpers/FormatVideoTime";

import {
  play,
  pause,
  minimize,
  fullscreen,
  // fastforward,
  // rewind,
  volumehigh,
  volumelow,
  volumemute,
  miniplayer,
} from "../../../Assets/images/videocontrols/index.js";

export default function VideoControls(props) {
  const {
    video,
    videoContainer,
    videoPage,
    isPlaying,
    setIsPlaying,
    isFullscreen,
    setIsFullscreen,
    videoControls,
  } = props;
  
  const container = useRef();
  const timelineContainer = container.current;

  const [currentPlaybackTime, setCurrentPlaybackTime] = useState("0:00");
  const [volumePosition, setVolumePosition] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);

  function handleTimelineUpdate(e) {
    if (timelineContainer) {
      const rect = timelineContainer?.getBoundingClientRect();
      const percent =
        Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
      timelineContainer.style.setProperty("--preview-position", percent);

      if (isScrubbing) {
        timelineContainer.style.setProperty("--progress-position", percent);
      }
    }
  }

  function toggleScrubbing(e) {
    const rect = timelineContainer.getBoundingClientRect();
    const percent =
      Math.min(Math.max(0, e.screenX - rect.x), rect.width) / rect.width;
    setIsScrubbing((e.buttons & 1) === 1);
    video.currentTime = percent * video.duration;
    if (isScrubbing) {
      // video.pause();
      // setIsPlaying(false);
    } else {
      // if (isPlaying) {
      //   video.play();
      //   setIsPlaying(true);
      // }
    }

    handleTimelineUpdate(e);
  }

  useEffect(() => {
    video.addEventListener("timeupdate", () => {
      setCurrentPlaybackTime(formatDuration(video.currentTime));
      const percent = video.currentTime / video.duration;
      timelineContainer?.style?.setProperty("--progress-position", percent);
    });

    return () => {
      video.removeEventListener("timeupdate", () => {});
    };
  });

  return (
    <div
      id="video-controls-container"
      ref={videoControls}
      onMouseUp={(e) => {
        if (isScrubbing) {
          toggleScrubbing(e);
        }
      }}
      onMouseMove={(e) => {
        if (isScrubbing) {
          handleTimelineUpdate(e);
        }
      }}
      onMouseEnter={(e) => {
        if (videoControls) {
          videoControls.current.style.display = 'block'
        }
        e.stopPropagation();
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div
        id="timeline-container"
        onMouseDown={(e) => {
          toggleScrubbing(e);
          e.stopPropagation();
        }}
        onMouseMove={(e) => {
          handleTimelineUpdate(e);
          e.stopPropagation();
        }}
        ref={container}
      >
        <div id="timeline" />
      </div>
      <div id="controls">
        <button id="play-pause">
          {isPlaying ? (
            <img
              id="pause-icon"
              className="control--icon"
              src={pause}
              alt="pause"
              onClick={(e) => {
                video.pause();
                setIsPlaying(false);
                e.stopPropagation();
              }}
            />
          ) : (
            <img
              id="play-icon"
              className="control--icon"
              src={play}
              alt="play"
              onClick={(e) => {
                video.play();
                setIsPlaying(true);
                e.stopPropagation();
              }}
            />
          )}
        </button>
        <div id="volume-container">
          <button
            id="volume-control"
            onClick={() => {
              if (volumePosition > 0) {
                video.volume = 0;
                setVolumePosition(0);
              } else {
                video.volume = 1;
                setVolumePosition(1);
              }
            }}
          >
            {volumePosition > 0.65 && (
              <img
                className="control--icon"
                src={volumehigh}
                alt="volumehigh"
              />
            )}
            {volumePosition <= 0.65 && volumePosition > 0 && (
              <img className="control--icon" src={volumelow} alt="volumelow" />
            )}
            {volumePosition === 0 && (
              <img
                className="control--icon"
                src={volumemute}
                alt="volumemute"
              />
            )}
          </button>
          <input
            id="volume-slider"
            type="range"
            min="0"
            max="1"
            step="any"
            onInput={(e) => {
              setVolumePosition(e.target.value);
              video.volume = e.target.value;
              e.stopPropagation();
            }}
            value={volumePosition}
          />
        </div>
        <svg id="duration-container" viewBox="0 0 90 25">
          <text x="0" y="18" fill="currentColor">
            {currentPlaybackTime}/{formatDuration(video.duration) || "0:00"}
          </text>
        </svg>
        <svg id="playback-speed" viewBox="0 0 15 25">
          <text x="0" y="18" fill="currentColor">
            1X
          </text>
        </svg>
        <button id="mini-player">
          <img src={miniplayer} alt="" className="control--icon" />
        </button>
        <button id="full-screen-control">
          {!isFullscreen && (
            <img
              id="maximize"
              className="control--icon"
              src={fullscreen}
              alt="enter fullscreen"
              onClick={(e) => {
                videoPage.classList.remove("mini-player");
                videoContainer.requestFullscreen();
                setIsFullscreen(true);
                e.stopPropagation();
              }}
            />
          )}
          {isFullscreen && (
            <img
              id="minimize"
              className="control--icon"
              src={minimize}
              alt="exit fullscreen"
              onClick={(e) => {
                document.exitFullscreen();
                setIsFullscreen(false);
                e.stopPropagation();
              }}
            />
          )}
        </button>
      </div>
    </div>
  );
}

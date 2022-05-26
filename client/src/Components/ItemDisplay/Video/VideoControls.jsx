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

let scrubbing
export default function VideoControls(props) {
  const {
    video,
    videoContainer,
    videoControls,
    togglePlay,
  } = props;

  const container = useRef();
  const timelineContainer = container.current;

  const [currentPlaybackTime, setCurrentPlaybackTime] = useState("0:00");
  const [volumePosition, setVolumePosition] = useState(0);

  function handleTimelineUpdate(e, scrubbing) {
    if (timelineContainer) {
      const rect = timelineContainer?.getBoundingClientRect();
      const percent =
        Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
      timelineContainer.style.setProperty("--preview-position", percent);

      if (scrubbing) {
        timelineContainer.style.setProperty("--progress-position", percent);
      }
    }
  }

  function toggleScrubbing(e) {
    const rect = timelineContainer.getBoundingClientRect();
    const percent =
      Math.min(Math.max(0, e.screenX - rect.x), rect.width) / rect.width;
    scrubbing = (e.buttons & 1) === 1
    video.currentTime = percent * video.duration;
    // if (scrubbing) {
    //   video.pause();
    // } else {
    //   if (!video.paused) {
    //     video.play();
    //   }
    // }

    handleTimelineUpdate(e, scrubbing);
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
        if (scrubbing) {
          toggleScrubbing(e);
        }
      }}
      onMouseMove={(e) => {
        if (scrubbing) {
          handleTimelineUpdate(e);
        }
      }}
      onMouseEnter={(e) => {
        if (videoControls) {
          videoControls.current.style.display = "block";
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
          <img
            className="control--icon"
            src={video.paused ? play : pause}
            alt="pause"
            onClick={() => {
              togglePlay();
            }}
          />
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
          <img
            className="control--icon"
            src={document.fullscreenElement ? minimize : fullscreen}
            alt="fullscreen"
            onClick={(e) => {
              videoContainer.requestFullscreen();
              e.stopPropagation();
            }}
          />
        </button>
      </div>
    </div>
  );
}

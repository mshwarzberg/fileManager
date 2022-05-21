import React, { useEffect, useState, useRef } from "react";
import { formatDuration } from "../../Helpers/VideoControlHelpers";

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
} from "../../Assets/images/videocontrols/index.js";

export default function VideoControls(props) {
  const {
    video,
    videoContainer,
    videoPage,
    isPlaying,
    setIsPlaying,
    isFullscreen,
    setIsFullscreen,
  } = props;
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState("0:00");
  const [volumePosition, setVolumePosition] = useState(0);

  const timeline = useRef();

  useEffect(() => {
    const timelineContainer = document.querySelector("#timeline-container")
    // Timeline
    timelineContainer.addEventListener("mousemove", handleTimelineUpdate);
    timelineContainer.addEventListener("mousedown", toggleScrubbing);
    document.addEventListener("mouseup", (e) => {
      if (isScrubbing) toggleScrubbing(e);
    });
    document.addEventListener("mousemove", (e) => {
      if (isScrubbing) handleTimelineUpdate(e);
    });

    let isScrubbing = false;
    let wasPaused;
    function toggleScrubbing(e) {
      const rect = timelineContainer.getBoundingClientRect();
      const percent =
        Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
      isScrubbing = (e.buttons & 1) === 1;
      videoContainer.classList.toggle("scrubbing", isScrubbing);
      if (isScrubbing) {
        wasPaused = video.paused;
        video.pause();
      } else {
        video.currentTime = percent * video.duration;
        if (!wasPaused) video.play();
      }

      handleTimelineUpdate(e);
    }

    function handleTimelineUpdate(e) {
      const rect = timelineContainer.getBoundingClientRect();
      const percent =
        Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
      timelineContainer.style.setProperty("--preview-position", percent);

      if (isScrubbing) {
        e.preventDefault();
        timelineContainer.style.setProperty("--progress-position", percent);
      }
    }
    video.addEventListener("timeupdate", () => {
      setCurrentPlaybackTime(formatDuration(video.currentTime));
    });
    return () => {
      video.removeEventListener("timeupdate", () => {});
      timelineContainer.removeEventListener('mousemove', () => {})
      timelineContainer.removeEventListener('mousedown', () => {})
      document.removeEventListener('mousemove', () => {})
      document.removeEventListener('mouseup', () => {})
      
    };
  });

  return (
    <div
      id="video-controls-container"
      onClick={(e) => {
        e.stopPropagation();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div id="timeline-container" ref={timeline}>
        <div id="timeline" />
      </div>
      <div id="controls">
        <button id="play-pause">
          {isPlaying ? (
            <img
              className="control--icon"
              src={pause}
              id="pause-icon"
              alt="pause"
              onClick={(e) => {
                video.pause();
                setIsPlaying(false);
                e.stopPropagation();
              }}
            />
          ) : (
            <img
              className="control--icon"
              src={play}
              id="play-icon"
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
            {video.volume > 0.65 && (
              <img
                className="control--icon"
                src={volumehigh}
                id="volume-high-icon"
                alt="volumehigh"
              />
            )}
            {video.volume <= 0.65 && video.volume > 0 && (
              <img
                className="control--icon"
                src={volumelow}
                id="volume-low-icon"
                alt="volumelow"
              />
            )}
            {video.volume === 0 && (
              <img
                className="control--icon"
                src={volumemute}
                id="volume-muted-icon"
                alt="volumemute"
              />
            )}
          </button>
          <div id="volume-slider" />
        </div>
        <div id="duration-container">
          <p>
            {currentPlaybackTime}/{formatDuration(video.duration) || "0:00"}
          </p>
        </div>
        <button id="playback-speed">1x</button>
        <button id="mini-player">
          <img src={miniplayer} alt="" className="control--icon" />
        </button>
        <button id="full-screen-control">
          {!isFullscreen && (
            <img
              className="control--icon"
              src={fullscreen}
              id="maximize"
              alt="enter fullscreen"
              onClick={() => {
                videoPage.classList.remove("mini-player");
                videoContainer.requestFullscreen();
                setIsFullscreen(true);
              }}
            />
          )}
          {isFullscreen && (
            <img
              className="control--icon"
              src={minimize}
              id="minimize"
              alt="exit fullscreen"
              onClick={() => {
                document.exitFullscreen();
                setIsFullscreen(false);
              }}
            />
          )}
        </button>
      </div>
    </div>
  );
}

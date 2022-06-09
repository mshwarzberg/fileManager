import React, { useEffect, useState, useRef } from "react";
import formatDuration from "../../../../Helpers/FormatVideoTime";

import {
  play,
  pause,
  minimize,
  fullscreen,
  miniplayer,
  repeat,
  repeatactive,
} from "../../../../Assets/images/videocontrols/index.js";
import Volume from "./Volume";

let scrubbing;

export default function VideoControls(props) {
  const {
    video,
    videoContainer,
    videoControls,
    togglePlay,
    setMiniPlayer,
    miniPlayer,
    videoPage,
  } = props;

  const playPauseButton = useRef();
  const container = useRef();
  const timelineContainer = container.current;

  const [currentPlaybackTime, setCurrentPlaybackTime] = useState("0:00");
  const [volumePosition, setVolumePosition] = useState(0);
  const [looping, setLooping] = useState(false);

  function handleTimelineUpdate(e) {
    const rect = timelineContainer?.getBoundingClientRect();
    const percent =
      Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    timelineContainer.style.setProperty("--preview-position", percent);
  }

  function toggleScrubbing(e) {
    const rect = timelineContainer.getBoundingClientRect();
    const percent =
      Math.min(Math.max(0, e.screenX - rect.x), rect.width) / rect.width;
    scrubbing = (e.buttons & 1) === 1;
    video.currentTime = percent * video.duration;

    handleTimelineUpdate(e, scrubbing);
  }

  useEffect(() => {
    video.addEventListener("pause", () => {
      if (playPauseButton && playPauseButton?.current) {
        playPauseButton.current.src = play;
      }
    });
    video.addEventListener("play", () => {
      if (playPauseButton && playPauseButton?.current) {
        playPauseButton.current.src = pause;
      }
    });
    video.addEventListener("ended", () => {
      if (looping) {
        video.play();
      }
    });
    video.addEventListener("timeupdate", () => {
      setCurrentPlaybackTime(formatDuration(video.currentTime));
      const percent = video.currentTime / video.duration;
      timelineContainer?.style?.setProperty("--progress-position", percent);
    });
    return () => {
      video.removeEventListener("timeupdate", () => {});
      video.removeEventListener("pause", () => {});
      video.removeEventListener("ended", () => {});
      video.removeEventListener("play", () => {});
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
        <div id="left-side-controls">
          <div id="repeat-container" className="control--button">
            <img
              src={looping ? repeatactive : repeat}
              onClick={() => {
                setLooping(!looping);
              }}
              alt="loop video"
            />
          </div>
          <button id="play-pause" className="control--button">
            <img
              ref={playPauseButton}
              src={play}
              alt="pause"
              onClick={() => {
                togglePlay();
              }}
            />
          </button>
          <Volume
            video={video}
            volumePosition={volumePosition}
            setVolumePosition={setVolumePosition}
          />
          <svg
            id="duration-container"
            viewBox="0 0 25 25"
            className="control--button"
          >
            <text x="-30" y="17.5" fill="currentColor">
              <title>
                {formatDuration(video.duration - video.currentTime)} remaining
              </title>
              {currentPlaybackTime}/{formatDuration(video.duration) || "0:00"}
            </text>
          </svg>
        </div>
        <div id="right-side-controls">
          <button
            id="mini-player-button"
            onClick={() => {
              setMiniPlayer(!miniPlayer);
              if (miniPlayer && videoPage) {
                videoPage.style.top = "";
                videoPage.style.left = "";
              }
            }}
            className="control--button"
          >
            <img
              src={miniplayer}
              alt="mini player"
              className="control--button"
            />
          </button>
          <button id="full-screen-control" className="control--button">
            <img
              src={document.fullscreenElement ? minimize : fullscreen}
              alt="fullscreen"
              onClick={(e) => {
                if (!document.fullscreenElement) {
                  setMiniPlayer(false);
                  videoContainer.requestFullscreen();
                } else {
                  document.exitFullscreen();
                }
                e.stopPropagation();
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { useEffect } from "react";
import {
  volumehigh,
  volumelow,
  volumemute,
  volumeveryhigh,
} from "../../../../Assets/images/videocontrols/index.js";
export default function Volume(props) {
  const { volumePosition, setVolumePosition, video } = props;
  useEffect(() => {
    video.addEventListener("volumechange", () => {
      if (video.volume > 0 && !video.muted) {
        setVolumePosition(video.volume);
      } else if (video.volume === 0 || video.muted) {
        setVolumePosition(0);
      }
    });
  }, [volumePosition]);

  return (
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
        className="control--button"
      >
        {volumePosition >= 0.7 && (
          <img
            className="control--icon"
            src={volumeveryhigh}
            alt="volumeveryhigh"
          />
        )}
        {volumePosition >= 0.3 && volumePosition < 0.7 && (
          <img className="control--icon" src={volumehigh} alt="volumehigh" />
        )}
        {volumePosition < 0.3 && volumePosition > 0 && (
          <img className="control--icon" src={volumelow} alt="volumelow" />
        )}
        {volumePosition === 0 && (
          <img className="control--icon" src={volumemute} alt="volumemute" />
        )}
      </button>
      <input
        id="volume-slider"
        type="range"
        min="0"
        max="1"
        step="any"
        onInput={(e) => {
          if (e.target.value > 0) {
            video.muted = false;
          }
          setVolumePosition(e.target.value);
          video.volume = e.target.value;
          e.stopPropagation();
        }}
        value={volumePosition}
      />
    </div>
  );
}

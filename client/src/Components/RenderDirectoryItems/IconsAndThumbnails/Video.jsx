import React, { useState, useEffect, useContext } from "react";

import playIcon from "../../../Assets/images/play.png";
import formatDuration from "../../../Helpers/FormatVideoTime";
import Filename from "./Icon/Filename";
import { GeneralContext } from "../../Main/App";

function Video({ item, setControllers }) {
  const { name, thumbPath, permission, duration, path } = item;

  const { state, setDirectoryItems } = useContext(GeneralContext);
  const [srcAttempts, setSrcAttempts] = useState(0);
  const [durationPosition, setDurationPosition] = useState({
    rectX: 0,
    rectY: 0,
    textX: 0,
    textY: 0,
  });

  useEffect(() => {
    if (sessionStorage.getItem(path)) {
      setDirectoryItems((prevItems) => {
        return prevItems.map((item) => {
          if (item.name === name) {
            return {
              ...item,
              ...JSON.parse(sessionStorage.getItem(path)),
            };
          }
          return item;
        });
      });
    }
    const newController = new AbortController();
    setControllers((prevControllers) => [...prevControllers, newController]);
    fetch("/api/mediametadata", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        currentdirectory: state.currentDirectory,
      }),
      signal: newController.signal,
    })
      .then(async (res) => {
        const response = await res.json();
        sessionStorage.setItem(path, JSON.stringify(response));
        setDirectoryItems((prevItems) => {
          return prevItems.map((item) => {
            if (item.name === name) {
              return {
                ...item,
                ...response,
              };
            }
            return item;
          });
        });
      })
      .catch(() => {});
    // eslint-disable-next-line
  }, []);

  function positionDuration(x, y) {
    setDurationPosition({
      rectX: (100 + x) / 2 - 25,
      rectY: (100 + y) / 2 - 10,
      textX: (100 + x) / 2 - 12.5,
      textY: (100 + y) / 2 - 2,
    });
  }

  return (
    thumbPath && (
      <div
        className="block-container"
        onMouseDown={(e) => {
          if (e.button === 0) {
            e.stopPropagation();
            return;
          }
        }}
      >
        <img src={playIcon} alt="playvideo" className="renderitem--play-icon" />
        <img
          style={{
            cursor: !permission ? "not-allowed" : "pointer",
          }}
          className="renderitem--thumbnail"
          src={thumbPath}
          onError={(e) => {
            e.target.parentElement.classList.add("loading");

            setTimeout(() => {
              if (srcAttempts <= 5) {
                e.target.src = thumbPath;
                setSrcAttempts((prev) => prev + 1);
                e.target.parentElement.classList.remove("loading");
              } else {
                setDirectoryItems((prevItems) => {
                  return prevItems.map((item) => {
                    if (item.name === name) {
                      return {
                        ...item,
                        thumbPath: null,
                      };
                    } else {
                      return item;
                    }
                  });
                });
              }
            }, 1000);
          }}
          alt=""
          onLoad={(e) => {
            const currentThumbWidth =
              e.currentTarget.getBoundingClientRect().width;
            const currentThumbHeight =
              e.currentTarget.getBoundingClientRect().height;
            const currentContainerWidth =
              e.currentTarget.parentElement.getBoundingClientRect().width;
            const currentContainerHeight =
              e.currentTarget.parentElement.getBoundingClientRect().height;

            const X =
              (currentThumbWidth / currentContainerWidth) * 100 +
              0.5 * (currentThumbWidth / currentContainerWidth);
            const Y =
              (currentThumbHeight / currentContainerHeight) * 100 +
              25 * (currentThumbHeight / currentContainerHeight);

            positionDuration(X, Y);
          }}
        />
        {durationPosition.rectX && durationPosition.rectY ? (
          <svg
            viewBox="0 0 100 100"
            style={{ zIndex: 1, pointerEvents: "none" }}
          >
            {duration && (
              <rect
                fill="#000000de"
                width="25%"
                height="10%"
                x={durationPosition.rectX}
                y={durationPosition.rectY}
              />
            )}
            <text
              fill="white"
              style={{
                fontSize: "0.5em",
                textAnchor: "middle",
                fontFamily: "akshar",
              }}
              x={durationPosition.textX}
              y={durationPosition.textY}
            >
              {formatDuration(duration)}
            </text>
          </svg>
        ) : (
          <></>
        )}
        <Filename name={name} />
      </div>
    )
  );
}

export default Video;

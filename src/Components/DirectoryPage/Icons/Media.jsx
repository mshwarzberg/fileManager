import React, { useState, useContext } from "react";

import formatVideoTime from "../../../Helpers/FormatVideoTime";
import { DirectoryContext } from "../../Main/App";
import { ffprobeMetadata } from "../../../Helpers/FS and OS/FFmpegFunctions";

export default function Media({ directoryItem }) {
  const { name, thumbPath, duration, path, size, fileextension } =
    directoryItem;

  const { state, setDirectoryItems, visibleItems } =
    useContext(DirectoryContext);

  const [srcAttempts, setSrcAttempts] = useState(0);

  return (
    thumbPath && (
      <div className="media-container">
        <img
          className="media-thumbnail"
          src={
            visibleItems.includes(document.getElementById(name))
              ? thumbPath
              : ""
          }
          onError={(e) => {
            if (!visibleItems.includes(document.getElementById(name))) {
              return;
            }
            if (srcAttempts === 0) {
              e.target.parentElement.parentElement.classList.add("loading");
            }

            if (srcAttempts >= 5 || size < 300000) {
              e.target.parentElement.parentElement.classList.remove("loading");
              setDirectoryItems((prevItems) => {
                return prevItems.map((item) => {
                  if (item.name === name) {
                    return {
                      ...item,
                      thumbPath: null,
                      isMedia: false,
                    };
                  } else {
                    return item;
                  }
                });
              });
            } else {
              setTimeout(() => {
                setSrcAttempts(srcAttempts + 1);
                e.target.src = thumbPath;
              }, 200);
            }
          }}
          alt=""
          onLoad={(e) => {
            e.target.parentElement.parentElement.classList.remove("loading");

            if (!state.networkDrives.includes(state.drive)) {
              if (sessionStorage.getItem(path + name)) {
                setDirectoryItems((prevItems) => {
                  return prevItems.map((item) => {
                    if (item.name === name) {
                      return {
                        ...item,
                        ...JSON.parse(
                          sessionStorage.getItem(path + name) || "{}"
                        ),
                      };
                    }
                    return item;
                  });
                });
              } else if (visibleItems.includes(document.getElementById(name))) {
                ffprobeMetadata(`${state.currentDirectory}${name}`, (data) => {
                  sessionStorage.setItem(path + name, JSON.stringify(data));
                  setDirectoryItems((prevItems) => {
                    return prevItems.map((item) => {
                      if (item.name === name) {
                        return {
                          ...item,
                          ...data,
                        };
                      }
                      return item;
                    });
                  });
                });
              }
            }
          }}
        />
        {duration ? (
          <>
            <p className="duration">{formatVideoTime(duration)}</p>
          </>
        ) : (
          <></>
        )}
      </div>
    )
  );
}

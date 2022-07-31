import React, { useContext } from "react";

import ImageGif from "./IconsAndThumbnails/ImageGif";
import Video from "./IconsAndThumbnails/Video";
import Icon from "./IconsAndThumbnails/Icon/Icon";

import { GeneralContext } from "../Main/App";
import formatDuration from "../../Helpers/FormatVideoTime";
import FormatSize from "../../Helpers/FormatSize";

export default function RenderItems() {
  const { directoryItems, dispatch, state, setDirectoryItems } =
    useContext(GeneralContext);

  // render the file data and thumbnails
  const renderItems = directoryItems?.map((item) => {
    const {
      name,
      size,
      itemtype,
      path,
      permission,
      thumbPath,
      duration,
      width,
      height,
      fileextension,
      prefix,
    } = item;

    function getTitle() {
      if (itemtype === "video" || itemtype === "image" || itemtype === "gif") {
        return `Name: ${name}\nPath: ${path}\nSize: ${
          FormatSize(size) || ""
        }\nDimensions: ${width + "x" + height}\n${
          duration ? `Duration: ${formatDuration(duration)}` : ""
        }`;
      }
      if (itemtype === "folder") {
        return `Name:${name}\nPath: ${path}`;
      } else {
        return `Name:${name}\nPath: ${path}\nSize: ${FormatSize(size) || ""}`;
      }
    }
    function getContextMenu() {
      if (item.isDirectory) {
        return [
          "rename",
          "cutcopy",
          "paste",
          "delete",
          "explorer",
          "properties",
        ];
      }
      if (permission) {
        return ["rename", "cutcopy", "delete", "properties"];
      }
    }

    if (name) {
      return (
        <div
          id={name}
          className="renderitem--block"
          key={`Name: ${name}\nSize: ${size}`}
          style={{
            cursor: !permission ? "not-allowed" : "pointer",
            border: !permission ? "2px solid red" : "",
            backgroundColor: !permission ? "#cc7878c5" : "",
          }}
          data-info={JSON.stringify({
            ...item,
            source: path,
            ...(item.isDirectory && { destination: path + "/" }),
          })}
        >
          {!thumbPath && <Icon item={item} />}
          {itemtype === "video" && <Video item={item} />}
          {(itemtype === "image" || itemtype === "gif") && (
            <ImageGif item={item} />
          )}
          <div
            className="cover-block"
            data-contextmenu={getContextMenu()}
            data-info={JSON.stringify({
              ...item,
              source: path,
              ...(item.isDirectory && { destination: path + "/" }),
            })}
            data-title={getTitle()}
            onClick={() => {
              if (!permission) {
                return;
              }
              if (item.isDrive) {
                dispatch({ type: "setDriveName", value: name });
                dispatch({ type: "openDirectory", value: name });
                return;
              } else if (item.isDirectory) {
                return dispatch({
                  type: "openDirectory",
                  value: state.currentDirectory + name + "/",
                });
              } else {
                fetch("/api/manage/open", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    path: path,
                  }),
                });
              }
            }}
            onMouseEnter={(e) => {
              if (
                e.target.previousSibling.firstChild.className ===
                "renderitem--play-icon"
              ) {
                e.target.previousSibling.firstChild.style.opacity = 1;
              }
              if (itemtype === "image" || itemtype === "gif") {
                fetch("/api/mediametadata", {
                  method: "post",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    prefix: prefix,
                    fileextension: fileextension,
                    currentdirectory: state.currentDirectory,
                  }),
                })
                  .then(async (res) => {
                    const response = await res.json();
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
                  .catch((e) => {
                    console.log(e);
                  });
              }
            }}
            onMouseLeave={(e) => {
              if (
                e.target.previousSibling.firstChild.className ===
                "renderitem--play-icon"
              ) {
                e.target.previousSibling.firstChild.style.opacity = 0;
              }
            }}
            style={{
              cursor: !permission ? "not-allowed" : "pointer",
            }}
          />
        </div>
      );
    }
    if (item.err) {
      return (
        <h1 key={item.err} style={{ color: "red" }}>
          {item.err}
        </h1>
      );
    }
    return "";
  });

  return (
    <div
      id="renderitem--page"
      data-contextmenu={[
        "view",
        "sort",
        "new folder",
        "paste",
        "refresh",
        "explorer",
        "properties",
      ]}
      data-info={JSON.stringify({
        path: state.currentDirectory,
        isDirectory: true,
        destination: state.currentDirectory,
      })}
    >
      {renderItems?.length > 0 ? (
        renderItems
      ) : (
        <h1 style={{ pointerEvents: "none" }}>Folder is empty</h1>
      )}
    </div>
  );
}

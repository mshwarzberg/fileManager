import React, { useState, useContext } from "react";

import ImageGif from "./IconsAndThumbnails/ImageGif";
import Video from "./IconsAndThumbnails/Video";
import Icon from "./IconsAndThumbnails/Icon/Icon";

import { DirectoryContext } from "../Main/App";
import ItemDisplay from "./ItemDisplay/ItemDisplay";
import formatDuration from "../../Helpers/FormatVideoTime";
import FormatSize from "../../Helpers/FormatSize";

export default function RenderItems() {
  const { directoryItems, dispatch, state } = useContext(DirectoryContext);

  const [viewItem, setViewItem] = useState({});

  function displayItem(filename, path, type, property) {
    if (type === "video") {
      return setViewItem({
        type: "video",
        property: property,
        name: filename,
        path: path,
      });
    } else if (type !== "unknown") {
      fetch("/api/loadfiles/file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: path,
          drive: state.drive,
        }),
      })
        .then(async (res) => {
          const response = await res.blob();
          const imageURL = URL.createObjectURL(response);
          if (type === "image" || type === "gif") {
            return setViewItem({
              type: "imagegif",
              property: imageURL,
              name: filename,
              path: path,
            });
          } else {
            const reader = new FileReader();
            reader.onload = () => {
              setViewItem({
                type: "document",
                property: reader.result,
                name: filename,
                path: path,
              });
            };
            return reader.readAsText(response);
          }
        })
        .catch((err) => {
          console.log("RenderItems.jsx displayfiles", err);
        });
    }
  }

  // render the file data and thumbnails
  const renderItems = directoryItems?.map((item) => {
    const {
      name,
      size,
      itemtype,
      path,
      permission,
      thumbnail,
      duration,
      width,
      height,
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
        return ["rename", "cutcopy", "paste", "delete", "properties"];
      }
      if (permission) {
        return ["open", "rename", "cutcopy", "delete", "properties"];
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
            border: !permission ? "1.5px solid red" : "",
            backgroundColor: !permission ? "#883333cc" : "",
          }}
          data-info={JSON.stringify({
            ...item,
            source: path,
            ...(item.isDirectory && { destination: path + "/" }),
          })}
        >
          {!thumbnail && <Icon item={item} />}
          {itemtype === "video" && <Video item={item} />}
          {(itemtype === "image" || itemtype === "gif") && (
            <ImageGif item={item} />
          )}
          <button
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
              } else if (permission) {
                return displayItem(
                  name,
                  path,
                  itemtype,
                  encodeURIComponent(path)
                );
              }
            }}
            onMouseEnter={(e) => {
              if (
                e.target.previousSibling.firstChild.className ===
                "renderitem--play-icon"
              ) {
                e.target.previousSibling.firstChild.style.opacity = 1;
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
      data-contextmenu={["view", "sort", "new folder", "paste", "properties"]}
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
      <ItemDisplay viewItem={viewItem} setViewItem={setViewItem} />
    </div>
  );
}

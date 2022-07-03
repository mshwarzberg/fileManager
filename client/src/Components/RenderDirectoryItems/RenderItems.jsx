import React, { useState, useRef, useContext } from "react";

import ImageGif from "./IconsAndThumbnails/ImageGif";
import Video from "./IconsAndThumbnails/Video";
import Icon from "./IconsAndThumbnails/Icon/Icon";

import { DirectoryContext } from "../Main/App";
import ItemDisplay from "./ItemDisplay/ItemDisplay";
import formatDuration from "../../Helpers/FormatVideoTime";

export default function RenderItems() {
  const { directoryItems, dispatch, state } = useContext(DirectoryContext);

  const [viewItem, setViewItem] = useState({});

  const page = useRef();

  function renderViewItem(filename, path, type, property) {
    if (type === "document") {
      return setViewItem({
        type: "document",
        property: property,
        name: filename,
        path: path,
      });
    }
    if (type === "video") {
      return setViewItem({
        type: "video",
        property: property,
        name: filename,
        path: path,
      });
    }
    if (type === "image" || type === "gif") {
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
          return setViewItem({
            type: "imagegif",
            property: imageURL,
            name: filename,
            path: path,
          });
        })
        .catch((err) => {
          console.log("RenderItems.jsx displayfiles", err);
        });
    }
  }

  function displayItem(filename, path, type) {
    // setting a 'default' property since the video is the only property that will not use fetch. If the type is not video the property will be overridden later on.
    return renderViewItem(filename, path, type, encodeURIComponent(path));
  }

  // render the file data and thumbnails
  const renderItems = directoryItems?.map((item) => {
    const {
      name,
      fileextension,
      size,
      itemtype,
      path,
      permission,
      thumbnail,
      formattedSize,
      duration,
      width,
      height,
    } = item;

    function getTitle() {
      if (itemtype === "video" || itemtype === "image" || itemtype === "gif") {
        return `Name: ${name}\nPath: ${path}\nSize: ${
          formattedSize || ""
        }\nDimensions: ${width + "x" + height}\n${
          duration ? `Duration: ${formatDuration(duration)}` : ""
        }`;
      }
      if (itemtype === "folder") {
        return `Name:${name}\nPath: ${path}`;
      } else {
        return `Name:${name}\nPath: ${path}\nSize: ${formattedSize || ""}`;
      }
    }

    if (name) {
      return (
        <div
          key={`Name: ${name}\nSize: ${size}\nType: ${fileextension}`}
          onClick={() => {
            if (item.isDrive) {
              dispatch({ type: "setDriveName", value: name });
              dispatch({ type: "openDirectory", value: name });
              return;
            }
            if (permission) {
              return displayItem(
                name,
                path,
                itemtype,
                directoryItems.indexOf(item),
                null
              );
            }
          }}
        >
          {!thumbnail && (
            <Icon
              item={item}
              index={directoryItems.indexOf(item)}
              getTitle={getTitle}
            />
          )}
          {itemtype === "video" && (
            <Video
              item={item}
              index={directoryItems.indexOf(item)}
              getTitle={getTitle}
            />
          )}
          {(itemtype === "image" || itemtype === "gif") && (
            <ImageGif
              item={item}
              index={directoryItems.indexOf(item)}
              getTitle={getTitle}
            />
          )}
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
    <div id="renderitem--page" ref={page}>
      {renderItems?.length > 0 ? (
        renderItems
      ) : (
        <h1 style={{ pointerEvents: "none" }}>Folder is empty</h1>
      )}
      <ItemDisplay viewItem={viewItem} setViewItem={setViewItem} />
    </div>
  );
}

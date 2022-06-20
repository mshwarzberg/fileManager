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

  function renderViewItem(filename, path, type, index, property) {
    if (type === "video") {
      return setViewItem({
        type: "video",
        property: property,
        index: index,
        name: filename,
        path: path,
      });
    } else if (type === "image" || type === "gif" || type === "document") {
      if (
        directoryItems[index].size > 25000000 &&
        directoryItems[index].itemtype === "document"
      ) {
        if (
          !window.confirm(
            "File is too large to view. Do you want to download it instead?"
          )
        ) {
          return;
        }
      }
      fetch(`/api/loadfiles/file`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: path,
          type: type,
          drive: state.drive,
        }),
      })
        .then(async (res) => {
          const response = await res.blob();
          if (res.headers.get("type") === "imagegif") {
            const imageURL = URL.createObjectURL(response);
            return setViewItem({
              type: "imagegif",
              property: imageURL,
              index: index,
              name: filename,
              path: path,
            });
          } else {
            if (directoryItems[index].size < 25000000) {
              const reader = new FileReader();
              reader.onload = () => {
                setViewItem({
                  type: "document",
                  property: reader.result,
                  index: index,
                  name: filename,
                  path: path,
                });
              };
              return reader.readAsText(response);
            }
            const url = window.URL.createObjectURL(response);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", directoryItems[index].name);
            link.click();
          }
        })
        .catch((err) => {
          console.log("RenderItems.jsx displayfiles", err);
        });
    }
  }

  function changeFolderOrViewFiles(filename, path, type, index, direction) {
    // arrow functionality to navigate through the files while item is displayed
    if (direction) {
      if (direction === "forwards") {
        for (let i = index + 1; i < directoryItems.length; i++) {
          type = directoryItems[i].itemtype;
          if (
            type === "video" ||
            type === "image" ||
            type === "document" ||
            type === "gif"
          ) {
            filename = directoryItems[i].name;
            path = directoryItems[i].path;
            index = i;
            break;
          }
        }
      } else if (direction === "backwards") {
        for (let i = index - 1; i > -1; i--) {
          type = directoryItems[i].itemtype;
          if (
            type === "video" ||
            type === "image" ||
            type === "document" ||
            type === "gif"
          ) {
            path = directoryItems[i].path;
            filename = directoryItems[i].name;
            index = i;
            break;
          }
        }
      }
    }
    if (type !== "folder") {
      // setting a 'default' property since the video is the only property that will not use fetch. If the type is not video the property will be overridden later on.
      return renderViewItem(
        filename,
        path,
        type,
        index,
        encodeURIComponent(path)
      );
    }
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
              return changeFolderOrViewFiles(
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
    if (item.msg) {
      return <h1 key={item.msg}>{item.msg}</h1>;
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
      <ItemDisplay
        changeFolderOrViewFiles={changeFolderOrViewFiles}
        viewItem={viewItem}
        setViewItem={setViewItem}
      />
    </div>
  );
}

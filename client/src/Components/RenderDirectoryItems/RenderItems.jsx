import React, { useEffect, useState, useRef, useContext } from "react";

import ImageGif from "./IconsAndThumbnails/ImageGif";
import Video from "./IconsAndThumbnails/Video";
import Icon from "./IconsAndThumbnails/Icon";

import { DirectoryContext } from "../Main/App";
import ItemDisplay from "./ItemDisplay/ItemDisplay";

export default function RenderItems() {
  const { directoryItems, dispatch, state } = useContext(DirectoryContext);

  const [viewItem, setViewItem] = useState({
    type: null,
    property: null,
    index: null,
    name: null,
    path: null,
  });
  const [isNavigating, setIsNavigating] = useState({
    value: false,
    visible: true,
  });

  const page = useRef();

  useEffect(() => {
    function navigateImagesAndVideos(e) {
      const isKeyForNavigating = [
        e.key === "ArrowLeft",
        e.key === "ArrowRight",
        e.key === "Tab",
        e.key === "CapsLock",
      ];
      if (!isKeyForNavigating.includes(true)) {
        return;
      }
      if (e.key === "CapsLock") {
        setIsNavigating({
          value: !isNavigating.value,
          visible: isNavigating.visible,
        });
      }
      if (e.key === "Tab") {
        setIsNavigating({
          value: isNavigating.value,
          visible: !isNavigating.visible,
        });
      }
      if (
        viewItem.property &&
        (e.key === "ArrowRight" || e.key === "ArrowLeft")
      ) {
        let direction;
        if (e.key === "ArrowRight" && isNavigating.value) {
          direction = "forwards";
        }
        if (e.key === "ArrowLeft" && isNavigating.value) {
          direction = "backwards";
        }
        changeFolderOrViewFiles(
          viewItem.name,
          viewItem.property,
          viewItem.type,
          viewItem.index,
          direction
        );
      }
    }
    document.addEventListener("keydown", navigateImagesAndVideos);
    return () => {
      document.removeEventListener("keydown", navigateImagesAndVideos);
    };
  });

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
            const reader = new FileReader();
            reader.onload = () => {
              setViewItem({
                type: "document",
                property: reader.result || " ",
                index: index,
                name: filename,
                path: path,
              });
            };
            reader.readAsText(response);
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
    const { name, fileextension, size, itemtype, path } = item;
    if (name) {
      return (
        <div
          key={`Name: ${name}\nSize: ${size}\nType: ${fileextension}`}
          onClick={() => {
            return changeFolderOrViewFiles(
              name,
              path,
              itemtype,
              directoryItems.indexOf(item),
              null
            );
          }}
        >
          <Video item={item} />
          <ImageGif item={item} />
          <Icon item={item} />
        </div>
      );
    }
    if (item.msg) {
      return <h1 key={item.msg}>{item.msg}</h1>;
    }
    if (!name) {
      return (
        <div
          className="renderitem--block"
          key={item}
          onClick={() => {
            dispatch({ type: "setDriveName", value: item });
            dispatch({ type: "openDirectory", value: item });
          }}
        >
          {item}
        </div>
      );
    }
    return "";
  });

  return (
    <div id="renderitem--page" ref={page}>
      {renderItems}
      <ItemDisplay
        changeFolderOrViewFiles={changeFolderOrViewFiles}
        viewItem={viewItem}
        setViewItem={setViewItem}
        isNavigating={isNavigating}
      />
    </div>
  );
}

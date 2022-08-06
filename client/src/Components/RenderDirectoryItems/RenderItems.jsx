import React, { useContext, useEffect, useState } from "react";

import ImageGif from "./IconsAndThumbnails/ImageGif";
import Video from "./IconsAndThumbnails/Video";
import Icon from "./IconsAndThumbnails/Icon/Icon";

import { GeneralContext } from "../Main/App";
import formatDuration from "../../Helpers/FormatVideoTime";
import FormatSize from "../../Helpers/FormatSize";
import TransferFunction from "../Tools/ContextMenu/Functions/TransferFunction";

export default function RenderItems({ controllers, setControllers }) {
  const { directoryItems, dispatch, state, setDirectoryItems } =
    useContext(GeneralContext);

  const [dragMe, setDragMe] = useState();

  useEffect(() => {
    function startDrag(e) {
      if (e.target.className === "cover-block" && e.button === 0) {
        setDragMe(e.target.parentElement);
      }
    }
    function dragElement(e) {
      if (dragMe) {
        dragMe.style.position = "fixed";
        dragMe.style.left = e.clientX + "px";
        dragMe.style.top = e.clientY + "px";
        dragMe.style.pointerEvents = "none";
        dragMe.style.zIndex = 100;
      }
    }
    function clearDrag(e) {
      if (e.target.dataset?.info && dragMe.lastChild.dataset?.info) {
        const destination = JSON.parse(e.target.dataset.info);
        const source = JSON.parse(dragMe.lastChild.dataset.info);
        if (
          (destination.isDirectory || destination.isDrive) &&
          destination.path
        ) {
          if (source.name === destination.name) {
            return;
          }
          TransferFunction(
            {
              source: source.path,
              mode: "cut",
              isDirectory: source.isDirectory,
              metadata: source,
            },
            destination.path,
            null,
            setDirectoryItems,
            state.currentDirectory
          );
        }
      }
      if (dragMe) {
        dragMe.style.zIndex = "";
        dragMe.style.position = "";
        dragMe.style.pointerEvents = "";
        dragMe.style.left = "";
        dragMe.style.top = "";
      }
      setDragMe(false);
    }
    document.addEventListener("mousedown", startDrag);
    document.addEventListener("mouseup", clearDrag);
    document.addEventListener("mousemove", dragElement);
    return () => {
      document.removeEventListener("mousedown", startDrag);
      document.removeEventListener("mousemove", dragElement);
      document.removeEventListener("mouseup", clearDrag);
    };
  }, [dragMe, setDragMe]);

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
      description,
    } = item;

    function navigateAndOpen() {
      if (!permission) {
        return;
      }
      if (item.isDrive) {
        dispatch({ type: "setDriveName", value: name });
        dispatch({ type: "openDirectory", value: name });
        return;
      } else if (item.isDirectory || item.isSymbolicLink) {
        let newPath = path;
        if (item.isSymbolicLink) {
          newPath = item.linkTo;
        }
        return dispatch({
          type: "openDirectory",
          value: newPath + "/",
        });
      } else {
        document.body.style.cursor = "progress";
        fetch("/api/manage/open", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: path,
          }),
        })
          .then(() => {
            document.body.style.cursor = "";
          })
          .catch(() => {
            document.body.style.cursor = "";
          });
      }
    }
    function getTitle() {
      if (itemtype === "video" || itemtype === "image" || itemtype === "gif") {
        return `Name: ${name}\nPath: ${path}\nSize: ${
          FormatSize(size) || ""
        }\nDimensions: ${width + "x" + height}${
          duration > 0.1 ? `\nDuration: ${formatDuration(duration)}` : ""
        }${description ? `\nDescription: ${description}` : ""}`;
      }
      if (itemtype === "folder") {
        return `Name: ${name}\nPath: ${path}`;
      } else {
        return `Name: ${name}\nPath: ${path}\nSize: ${FormatSize(size) || ""}`;
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
        return ["rename", "cutcopy", "delete", "properties", "explorer"];
      }
    }

    if (name) {
      return (
        <div
          id={name}
          className="renderitem--block"
          key={`Name: ${name}\nSize: ${size}`}
          style={{
            cursor: !permission ? "not-allowed" : "",
            border: !permission ? "2px solid red" : "",
            backgroundColor: !permission ? "#cc7878c5" : "",
            width: localStorage.getItem("blockWidth") || "10rem",
          }}
        >
          {!thumbPath && <Icon item={item} />}
          {itemtype === "video" && (
            <Video
              item={item}
              controllers={controllers}
              setControllers={setControllers}
            />
          )}
          {(itemtype === "image" || itemtype === "gif") && (
            <ImageGif item={item} />
          )}
          <button
            className="cover-block"
            data-contextmenu={getContextMenu()}
            data-info={JSON.stringify(item)}
            data-title={getTitle()}
            onClick={(e) => {
              if (e.nativeEvent.pointerId === -1) {
                navigateAndOpen();
              }
            }}
            onDoubleClick={() => {
              navigateAndOpen();
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
                    name: name,
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
              cursor: !permission ? "not-allowed" : "",
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
    >
      {renderItems?.length > 0 ? (
        renderItems
      ) : (
        <h1 style={{ pointerEvents: "none" }}>Folder is empty</h1>
      )}
    </div>
  );
}

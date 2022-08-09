import React, { useContext } from "react";

import ImageGif from "./IconsAndThumbnails/ImageGif";
import Video from "./IconsAndThumbnails/Video";
import Icon from "./IconsAndThumbnails/Icon/Icon";

import { GeneralContext } from "../Main/App";
import getTitle from "../../Helpers/getTitle";
import getContextMenu from "../../Helpers/getContextMenu";
import CheckIfExists from "../../Helpers/CheckIfExists";

export default function RenderItems({
  controllers,
  setControllers,
  itemsSelected,
  setItemsSelected,
}) {
  const { directoryItems, dispatch, state, setDirectoryItems } =
    useContext(GeneralContext);

  // render the file data and thumbnails
  const renderItems = directoryItems?.map((item) => {
    const { name, size, itemtype, path, permission, thumbPath } = item;

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
    }

    if (name) {
      return (
        <div
          className="renderitem--block"
          data-info={permission ? JSON.stringify(item) : "{}"}
          key={`Name: ${name}\nSize: ${size}`}
          style={{
            border: !permission ? "2px solid red" : "",
            backgroundColor: !permission ? "#cc7878c5" : "",
            width: localStorage.getItem("blockWidth") || "10rem",
            ...(CheckIfExists(itemsSelected, path, "path") && {
              backgroundColor: "#222233",
              outline: "2px solid #111",
              borderRadius: "1px",
            }),
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
            data-contextmenu={getContextMenu(item.isDirectory, permission)}
            data-info={permission ? JSON.stringify(item) : null}
            data-title={getTitle(item)}
            onClick={(e) => {
              if (e.nativeEvent.pointerId === -1) {
                navigateAndOpen();
                return;
              }
              if (CheckIfExists(itemsSelected, item.path, "path")) {
                if (e.ctrlKey) {
                  setItemsSelected((prevItems) => {
                    return prevItems
                      .map((prevItem) => {
                        if (prevItem.path === path) {
                          return {};
                        }
                        return prevItem;
                      })
                      .filter((prevItem) => prevItem.name && prevItem);
                  });
                }
              } else {
                if (e.ctrlKey) {
                  setItemsSelected((prevItems) => [...prevItems, item]);
                  return;
                } else if (e.button !== 2) {
                  setItemsSelected([item]);
                }
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
                  .catch((e) => {});
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
      data-info={JSON.stringify({
        path: state.currentDirectory,
        isDirectory: true,
      })}
    >
      <div id="highlight--box" />
      {renderItems?.length > 0 ? (
        renderItems
      ) : (
        <h1 style={{ pointerEvents: "none" }}>Folder is empty</h1>
      )}
    </div>
  );
}

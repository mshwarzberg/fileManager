import React, { useContext } from "react";

import ImageGif from "./IconsAndThumbnails/ImageGif";
import Video from "./IconsAndThumbnails/Video";
import Icon from "./IconsAndThumbnails/Icon/Icon";

import { GeneralContext } from "../Main/App";
import getTitle from "../../Helpers/getTitle";
import getContextMenu from "../../Helpers/getContextMenu";
import CheckIfExists from "../../Helpers/CheckIfExists";

export default function DisplayPage({ controllers, setControllers }) {
  const {
    directoryItems,
    dispatch,
    state,
    setDirectoryItems,
    itemsSelected,
    setItemsSelected,
  } = useContext(GeneralContext);

  const renderItems = directoryItems?.map((directoryItem) => {
    const { name, size, itemtype, path, permission, thumbPath } = directoryItem;

    function navigateAndOpen() {
      if (!permission) {
        return;
      }
      if (directoryItem.isDrive) {
        dispatch({ type: "setDriveName", value: name });
        dispatch({ type: "openDirectory", value: name });
        return;
      } else if (directoryItem.isDirectory || directoryItem.isSymbolicLink) {
        let newPath = path + name;
        if (directoryItem.isSymbolicLink) {
          newPath = directoryItem.linkTo;
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
            path: path + name,
          }),
        });
      }
    }
    if (name) {
      return (
        <div
          className="renderitem--block"
          data-info={permission ? JSON.stringify(directoryItem) : "{}"}
          key={`Name: ${name}\nSize: ${size}`}
          style={{
            border: !permission ? "2px solid red" : "",
            backgroundColor: !permission ? "#cc7878c5" : "",
            width: localStorage.getItem("blockWidth") || "10rem",
            ...(CheckIfExists(
              itemsSelected,
              name,
              "name",
              directoryItem.path,
              "path"
            ) &&
              permission && {
                backgroundColor: "#cccccccc",
                outline: "2px solid #111",
              }),
          }}
        >
          {!thumbPath && <Icon directoryItem={directoryItem} />}
          {itemtype === "video" && (
            <Video
              directoryItem={directoryItem}
              controllers={controllers}
              setControllers={setControllers}
            />
          )}
          {(itemtype === "image" || itemtype === "gif") && (
            <ImageGif directoryItem={directoryItem} />
          )}
          <button
            className="cover-block"
            data-contextmenu={getContextMenu(
              directoryItem.isDirectory,
              permission
            )}
            data-info={permission ? JSON.stringify(directoryItem) : null}
            data-title={getTitle(directoryItem)}
            onClick={(e) => {
              if (e.nativeEvent.pointerId === -1) {
                navigateAndOpen();
                return;
              }
              if (
                CheckIfExists(
                  itemsSelected,
                  directoryItem.name,
                  "name",
                  directoryItem.path,
                  "path"
                )
              ) {
                if (e.ctrlKey) {
                  setItemsSelected((prevItems) => {
                    return prevItems
                      .map((prevItem) => {
                        if (prevItem.name === name) {
                          return {};
                        }
                        return prevItem;
                      })
                      .filter((prevItem) => prevItem.name && prevItem);
                  });
                }
              } else {
                if (e.ctrlKey) {
                  setItemsSelected((prevItems) => [
                    ...prevItems,
                    directoryItem,
                  ]);
                  return;
                } else if (e.button !== 2) {
                  setItemsSelected([directoryItem]);
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
    if (directoryItem.err) {
      return (
        <h1 key={directoryItem.err} style={{ color: "red" }}>
          {directoryItem.err}
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
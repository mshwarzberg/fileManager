import React, { useContext } from "react";

import ImageGif from "./IconsAndThumbnails/ImageGif";
import Video from "./IconsAndThumbnails/Video";
import Icon from "./IconsAndThumbnails/Icon/Icon";

import { GeneralContext } from "../Main/App";
import GetTitle from "../../Helpers/GetTitle";
import GetContextMenu from "../../Helpers/GetContextMenu";
import { foundInArrayObject } from "../../Helpers/SearchArray";

import Open from "./FS and OS/Open";
import getMediaMetadata from "./FS and OS/GetMediaMetadata";

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
    const {
      name,
      size,
      itemtype,
      path,
      permission,
      thumbPath,
      isDirectory,
      isDrive,
    } = directoryItem;

    function navigateAndOpen() {
      if (!permission) {
        return;
      }
      if (directoryItem.isDrive) {
        dispatch({ type: "setDriveName", value: path });
        dispatch({ type: "openDirectory", value: path });
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
        Open(path + name);
      }
    }
    if (name) {
      return (
        <div
          className="renderitem--block"
          key={`Name: ${name}\nSize: ${size}`}
          style={{
            border: !permission ? "2px solid red" : "",
            backgroundColor: !permission ? "#cc7878c5" : "",
            width: localStorage.getItem("blockWidth") || "10rem",
            ...(foundInArrayObject(
              itemsSelected,
              [name, directoryItem.path],
              ["name", "path"],
              "info"
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
            data-contextmenu={GetContextMenu(
              directoryItem.isDirectory,
              permission
            )}
            data-info={permission ? JSON.stringify(directoryItem) : null}
            data-destination={
              (isDirectory || isDrive) && permission
                ? JSON.stringify({ destination: path + name + "/" })
                : null
            }
            data-title={GetTitle(directoryItem)}
            onClick={(e) => {
              if (
                foundInArrayObject(
                  itemsSelected,
                  [name, directoryItem.path],
                  ["name", "path"],
                  "info"
                )
              ) {
                if (e.ctrlKey) {
                  setItemsSelected((prevItems) => {
                    return prevItems
                      .map((prevItem) => {
                        if (prevItem.info.name === name) {
                          return {};
                        }
                        return prevItem;
                      })
                      .filter((prevItem) => prevItem.info && prevItem);
                  });
                }
              } else {
                if (e.ctrlKey) {
                  setItemsSelected((prevItems) => [
                    ...prevItems,
                    { element: e.target.parentElement, info: directoryItem },
                  ]);
                  return;
                } else if (e.button !== 2) {
                  setItemsSelected([
                    { element: e.target.parentElement, info: directoryItem },
                  ]);
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
                getMediaMetadata().then((result) => {
                  setDirectoryItems((prevItems) => {
                    return prevItems.map((item) => {
                      if (item.name === name) {
                        return {
                          ...item,
                          ...result,
                        };
                      }
                      return item;
                    });
                  });
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
      data-destination={JSON.stringify({
        destination: state.currentDirectory,
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

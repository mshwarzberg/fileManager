import { useContext, useState, useEffect } from "react";
import { GeneralContext } from "../Main/App.jsx";

import clickOnItem from "../../Helpers/ClickOnItem";
import handleItemsSelected from "../../Helpers/HandleItemsSelected";
import contextMenuOptions from "../../Helpers/ContextMenuOptions";
import getVideoAtPercentage from "../../Helpers/FS and OS/GetVideoAtPercentage.js";

import formatDuration from "../../Helpers/FormatVideoTime";
import formatSize from "../../Helpers/FormatSize.js";
import formatTitle from "../../Helpers/FormatTitle";
import formatDate from "../../Helpers/FormatDate.js";

import ItemName from "./Icons/ItemName.jsx";
import CustomDriveIcon from "./Icons/CustomDriveIcon";
import CustomFileIcon from "./Icons/CustomFileIcon";
import CustomFolderIcon from "./Icons/CustomFolderIcon";

const fs = window.require("fs");
const sharp = window.require("sharp");
const exifr = window.require("exifr");
const { execFile, exec, execFileSync } = window.require("child_process");

let clickOnNameTimeout, selectTimeout, dragTimeout;
export default function PageItem({
  selectedItems: [selectedItems, setSelectedItems],
  lastSelected: [lastSelected, setLastSelected],
  viewTypeTabWidth,
  directoryItem,
  visibleItems,
  setDrag,
}) {
  const {
    path,
    name,
    isDirectory,
    permission,
    thumbPath,
    isMedia,
    filetype,
    size,
    isDrive,
    isSymbolicLink,
    linkTo,
    duration,
    isFile,
    fileextension,
    modified,
    dimensions,
  } = directoryItem;

  const {
    dispatch,
    state: { currentDirectory, drive },
    setRenameItem,
    renameItem,
    settings: {
      clickToOpen,
      showThumbnails,
      iconSize,
      pageView,
      pageCompactView,
    },
    directoryItems,
  } = useContext(GeneralContext);

  const [thumbnail, setThumbnail] = useState();
  const [description, setDescription] = useState();

  const selectedElements = selectedItems.map(
    (selectedItem) => selectedItem.element
  );

  useEffect(() => {
    let timeout;
    if (isMedia && filetype !== "audio" && showThumbnails) {
      function createThumbnails() {
        timeout = setTimeout(() => {
          if (filetype === "image") {
            sharp(path)
              .resize({ width: 400 })
              .toFile(thumbPath)
              .then(() => {
                setThumbnail(thumbPath);
              })
              .catch((e) => {});
          } else {
            let output = execFileSync("ffprobe.exe", [
              "-show_format",
              "-print_format",
              "json",
              path,
            ]);
            output = JSON.parse(output || "{}");
            let { duration } = output["format"];
            execFile(
              "ffmpeg.exe",
              [
                "-ss",
                getVideoAtPercentage(duration * 1),
                "-i",
                path,
                "-vf",
                "scale=400:-2",
                "-vframes",
                "1",
                "-y",
                thumbPath,
              ],
              (err, _) => {
                if (!err) {
                  setThumbnail(thumbPath);
                }
              }
            );
          }
        }, directoryItems.indexOf(directoryItem) * 10);
      }
      timeout = setTimeout(() => {
        try {
          fs.accessSync(thumbPath);
          setThumbnail(thumbPath);
        } catch {
          if (currentDirectory === "Trash" && size < 300000) {
            setThumbnail(drive + "trash/" + name);
          } else {
            createThumbnails();
          }
        }
      }, directoryItems.indexOf(directoryItem) * 3);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [currentDirectory, showThumbnails]);

  function mainContent() {
    if (
      thumbnail &&
      showThumbnails &&
      isMedia &&
      pageView !== "list" &&
      pageView !== "details"
    ) {
      return (
        <div className="media-container">
          <img
            src={thumbnail}
            className="media-thumbnail"
            style={{
              ...(pageView === "icon" && {
                maxHeight: iconSize * (9 / 10) + "rem",
              }),
            }}
            onError={() => {
              setThumbnail();
            }}
          />
          {duration && (
            <div className="duration">{formatDuration(duration)}</div>
          )}
        </div>
      );
    } else if (isFile) {
      return <CustomFileIcon fileextension={fileextension.split(".")[1]} />;
    } else if (isDirectory || isSymbolicLink) {
      return <CustomFolderIcon directoryPath={path + "/"} />;
    } else if (isDrive) {
      return <CustomDriveIcon directoryItem={directoryItem} />;
    }
  }
  function metadataContent() {
    if (pageView === "content") {
      return (
        <>
          <div className="information-container">
            <p className="date">
              Date Modified: {formatDate(new Date(modified), true)}
            </p>
            {size ? <p>Size: {formatSize(size)}</p> : <></>}
          </div>
          <div className="metadata-container">
            <p className="dimensions">Dimensions: {dimensions}</p>
            <p className="type">
              Type:&nbsp;
              {fileextension ? filetype.toUpperCase() : "FOLDER"}
            </p>
          </div>
        </>
      );
    } else if (pageView === "details") {
      return (
        <>
          <p
            className="details-metadata"
            style={{
              width: viewTypeTabWidth.modified + "rem",
              marginLeft: viewTypeTabWidth.name + "rem",
            }}
          >
            {formatDate(new Date(modified))}
          </p>
          <p
            className="details-metadata"
            style={{
              width: viewTypeTabWidth.type + "rem",
            }}
          >
            Type:&nbsp;
            {fileextension
              ? fileextension.slice(1, Infinity).toUpperCase() + " FILE"
              : "FOLDER"}
          </p>
          <p
            className="details-metadata"
            style={{
              width: viewTypeTabWidth.size + "rem",
            }}
          >
            {size ? formatSize(size) : ""}
          </p>
          <p
            className="details-metadata"
            style={{
              width: viewTypeTabWidth.duration + "rem",
            }}
          >
            {duration ? formatDuration(duration) : ""}
          </p>
          <p
            className="details-metadata"
            style={{
              width: viewTypeTabWidth.dimensions + "rem",
            }}
          >
            {dimensions || ""}
          </p>
        </>
      );
    } else {
      return <></>;
    }
  }
  function className() {
    let clsName = "page-item";
    if (clickToOpen === "single") {
      clsName += " single-click";
    }
    if (pageCompactView) {
      clsName += " compacted-block";
    }
    if (!permission) {
      clsName += " no-permission";
    }
    return clsName;
  }

  return visibleItems.includes(document.getElementById(path)) && name ? (
    <div
      className={className()}
      id={path}
      style={{
        ...(pageView === "icon" && {
          width: iconSize + "rem",
          minHeight: iconSize + "rem",
        }),
      }}
      onMouseEnter={() => {
        if (filetype === "image") {
          exifr
            .parse(path, true)
            .then((data) => {
              if (!data) {
                return;
              }
              setDescription(
                data.Comment || data.description?.value || data.description
              );
            })
            .catch(() => {});
        }
      }}
      onMouseMove={(e) => {
        if (selectedElements.includes(e.target)) {
          clearTimeout(selectTimeout);
        } else if (clickToOpen === "single") {
          clearTimeout(selectTimeout);
          selectTimeout = setTimeout(() => {
            handleItemsSelected(
              e,
              selectedItems,
              setSelectedItems,
              lastSelected,
              setLastSelected
            );
          }, 1000);
        }
      }}
      onMouseUp={() => {
        clearTimeout(dragTimeout);
      }}
      onMouseDown={(e) => {
        if (e.button === 0 || e.button === 2) {
          selectTimeout = setTimeout(
            () => {
              handleItemsSelected(
                e,
                selectedItems,
                setSelectedItems,
                lastSelected,
                setLastSelected
              );
            },
            selectedElements.includes(e.target) ? 200 : 0
          );
          if (selectedElements.includes(e.target)) {
            dragTimeout = setTimeout(() => {
              setDrag({
                x: e.clientX - 64,
                y: e.clientY - 64,
              });
            }, 150);
          }
          if (!e.shiftKey && !e.ctrlKey) {
            clickOnNameTimeout = setTimeout(() => {
              setRenameItem({
                element: null,
                path: path,
              });
            }, 1000);
          }
        }
      }}
      onMouseLeave={() => {
        clearTimeout(selectTimeout);
      }}
      onClick={() => {
        if (clickToOpen === "single") {
          clickOnItem(directoryItem, dispatch);
        }
      }}
      onDoubleClick={(e) => {
        clearTimeout(clickOnNameTimeout);
        setRenameItem({});
        clickOnItem(directoryItem, dispatch);
      }}
      onContextMenu={() => {
        clearTimeout(clickOnNameTimeout);
        setRenameItem({});
      }}
      data-contextmenu={contextMenuOptions(directoryItem)}
      data-info={permission && JSON.stringify({ ...directoryItem, path: path })}
      data-title={formatTitle({ ...directoryItem, description: description })}
      data-timing={isDirectory && 400}
      data-destination={(() => {
        if (isDirectory) {
          return path + "/";
        } else if (isDrive) {
          return path;
        } else if (isSymbolicLink) {
          return linkTo;
        } else {
          return null;
        }
      })()}
    >
      {mainContent()}
      <ItemName
        directoryItem={directoryItem}
        renameItem={renameItem}
        setRenameItem={setRenameItem}
      />
      {metadataContent()}
    </div>
  ) : (
    <div
      className={className()}
      id={path}
      style={{
        ...(pageView === "icon" && {
          width: iconSize + "rem",
          minHeight: iconSize + "rem",
        }),
      }}
      data-info={permission && JSON.stringify({ ...directoryItem, path: path })}
    />
  );
}

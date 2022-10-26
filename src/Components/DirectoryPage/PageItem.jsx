import { useContext, useState, useEffect } from "react";
import { GeneralContext } from "../Main/App.jsx";
import handleItemsSelected from "../../Helpers/HandleItemsSelected";
import ItemName from "./Icons/ItemName";
import contextMenuOptions from "../../Helpers/ContextMenuOptions";
import formatTitle from "../../Helpers/FormatTitle";
import CustomFileIcon from "./Icons/CustomFileIcon";

import clickOnItem from "../../Helpers/ClickOnItem";
import { ffmpegThumbs } from "../../Helpers/FS and OS/FFmpeg";
import formatDuration from "../../Helpers/FormatVideoTime.js";
import CustomFolderIcon from "./Icons/CustomFolderIcon.jsx";
import CustomDriveIcon from "./Icons/CustomDriveIcon.jsx";

const fs = window.require("fs");
const sharp = window.require("sharp");
const exifr = window.require("exifr");

let clickOnNameTimeout, selectTimeout;
export default function PageItem({
  directoryItem,
  visibleItems,
  setSelectedItems,
  selectedItems,
  lastSelected,
  setLastSelected,
}) {
  const {
    path,
    name,
    isDirectory,
    isFile,
    permission,
    fileextension,
    thumbPath,
    isMedia,
    isSymbolicLink,
    filetype,
    duration,
    size,
    isDrive,
  } = directoryItem;

  const {
    dispatch,
    state: { currentDirectory, drive },
    renameItem,
    setRenameItem,
    settings: { clickToOpen, showThumbnails, iconSize, pageCompactView },
    setDirectoryItems,
    directoryItems,
  } = useContext(GeneralContext);

  const [thumbnail, setThumbnail] = useState();

  const selectedElements = selectedItems.map(
    (selectedItem) => selectedItem.element
  );
  const tempPath = `${drive}temp/${currentDirectory.slice(
    drive.length,
    currentDirectory.length
  )}`;

  useEffect(() => {
    let timeout;
    if (isMedia && filetype !== "audio" && showThumbnails) {
      if (currentDirectory !== "Trash") {
        fs.mkdirSync(tempPath, { recursive: true });
      }
      function createThumbnails() {
        if (filetype === "image") {
          sharp(path)
            .resize({ width: 400 })
            .toFile(thumbPath)
            .then(() => {
              setThumbnail(thumbPath);
            })
            .catch((e) => {});
        } else {
          ffmpegThumbs(path, thumbPath).then(() => {
            setThumbnail(thumbPath);
          });
        }
      }
      timeout = setTimeout(() => {
        try {
          fs.accessSync(thumbPath);
          setThumbnail(thumbPath);
        } catch {
          if (currentDirectory === "Trash" && size < 300000) {
            setThumbnail(drive + "trash/" + name);
            return;
          }
          createThumbnails();
        }
      }, directoryItems.indexOf(directoryItem));
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [currentDirectory, showThumbnails]);

  return (
    <div
      className={`display-page-block ${
        clickToOpen === "single" ? "single-click" : ""
      } ${pageCompactView ? "compact-page" : ""}`}
      id={path}
      style={{
        width: iconSize + "rem",
        minHeight: iconSize + "rem",
      }}
      onMouseEnter={() => {
        if (filetype === "image") {
          exifr
            .parse(path, true)
            .then((data) => {
              if (!data) {
                return;
              }
              const description =
                data.Comment || data.description?.value || data.description;
              setDirectoryItems((prevItems) =>
                prevItems.map((prevItem) => {
                  if (prevItem.name === name) {
                    return {
                      ...prevItem,
                      description: description,
                    };
                  }
                  return prevItem;
                })
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
      onMouseDown={(e) => {
        if (e.button === 0 || e.button === 2) {
          if (!e.shiftKey && !e.ctrlKey && renameItem !== path) {
            clickOnNameTimeout = setTimeout(() => {
              setRenameItem((prevRename) =>
                prevRename === path ? null : path
              );
            }, 1000);
          }
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
        if (!permission || e.ctrlKey || e.shiftKey) {
          return;
        }
        setRenameItem();
        clickOnItem(directoryItem, dispatch);
      }}
      onContextMenu={() => {
        clearTimeout(clickOnNameTimeout);
        setRenameItem();
      }}
      onBlur={(e) => {
        if (e.relatedTarget?.className !== "block-name") {
          setRenameItem();
        }
      }}
      data-contextmenu={permission && contextMenuOptions(directoryItem)}
      data-info={permission && JSON.stringify({ ...directoryItem, path: path })}
      data-title={formatTitle(directoryItem)}
      data-timing={isDirectory && 400}
      data-destination={JSON.stringify({
        destination: path + "/",
      })}
    >
      {visibleItems.includes(document.getElementById(path)) && (
        <>
          {thumbnail && showThumbnails && isMedia ? (
            <div className="media-container">
              <img
                src={thumbnail}
                className="media-thumbnail"
                style={{
                  maxHeight: iconSize * (9 / 10) + "rem",
                }}
                onError={() => {
                  setThumbnail();
                }}
              />
              {duration && (
                <div className="duration">{formatDuration(duration)}</div>
              )}
            </div>
          ) : (
            isFile && (
              <CustomFileIcon fileextension={fileextension.split(".")[1]} />
            )
          )}
          {(isDirectory || isSymbolicLink) && (
            <CustomFolderIcon directoryPath={path + "/"} />
          )}
          {isDrive && <CustomDriveIcon directoryItem={directoryItem} />}
          <ItemName
            directoryItem={directoryItem}
            renameItem={renameItem}
            setRenameItem={setRenameItem}
          />
        </>
      )}
    </div>
  );
}

import { useContext, useState, useEffect } from "react";
import { GeneralContext } from "../Main/App.jsx";

import clickOnItem from "../../Helpers/ClickOnItem";
import handleItemsSelected from "../../Helpers/HandleItemsSelected";

import ItemName from "./Icons/ItemName";

import blockContent from "../../Helpers/BlockContent.js";
import contextMenuOptions from "../../Helpers/ContextMenuOptions";
import formatTitle from "../../Helpers/FormatTitle";

import { ffmpegThumbs } from "../../Helpers/FS and OS/FFmpeg";

const fs = window.require("fs");
const sharp = window.require("sharp");
const exifr = window.require("exifr");

let clickOnNameTimeout, selectTimeout, dragTimeout;
export default function PageItem({
  directoryItem,
  visibleItems,
  setSelectedItems,
  selectedItems,
  lastSelected,
  setLastSelected,
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
  } = directoryItem;

  const {
    dispatch,
    state: { currentDirectory, drive },
    renameItem,
    setRenameItem,
    settings: { clickToOpen, showThumbnails, iconSize, pageCompactView },
    directoryItems,
  } = useContext(GeneralContext);

  const [thumbnail, setThumbnail] = useState();
  const [description, setDescription] = useState();

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

  return visibleItems.includes(document.getElementById(path)) ? (
    <div
      className={`display-page-block ${
        clickToOpen === "single" ? "single-click" : ""
      } ${pageCompactView ? "compacted-block" : ""}`}
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
        // left click or right click
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
            // don't unselect selected element for 200ms to allow drag and drop
            selectedElements.includes(e.target) ? 200 : 0
          );
          if (selectedElements.includes(e.target)) {
            dragTimeout = setTimeout(() => {
              setDrag({
                x: e.clientX - 64,
                y: e.clientY - 64,
              });
            }, 200);
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
        if (!permission || e.ctrlKey || e.shiftKey) {
          return;
        }
        setRenameItem({});
        clickOnItem(directoryItem, dispatch);
      }}
      onContextMenu={() => {
        clearTimeout(clickOnNameTimeout);
        setRenameItem({});
      }}
      data-contextmenu={permission && contextMenuOptions(directoryItem)}
      data-info={permission && JSON.stringify({ ...directoryItem, path: path })}
      data-title={formatTitle({ ...directoryItem, description: description })}
      data-timing={isDirectory && 400}
      data-destination={
        isDirectory || isDrive ? path + "/" : isSymbolicLink ? linkTo : null
      }
    >
      <>
        {blockContent(directoryItem, showThumbnails, iconSize, [
          thumbnail,
          setThumbnail,
        ])}
        <ItemName
          directoryItem={directoryItem}
          renameItem={renameItem}
          setRenameItem={setRenameItem}
        />
      </>
    </div>
  ) : (
    <div
      className={`display-page-block ${
        clickToOpen === "single" ? "single-click" : ""
      } ${pageCompactView ? "compacted-block" : ""}`}
      id={path}
      style={{
        width: iconSize + "rem",
        minHeight: iconSize + "rem",
      }}
      data-info={permission && JSON.stringify({ ...directoryItem, path: path })}
    />
  );
}

import { useContext, useState, useEffect } from "react";
import { DirectoryContext } from "../Main/App";
import handleItemsSelected from "../../Helpers/HandleItemsSelected";
import ItemName from "./Icons/ItemName";
import contextMenuOptions from "../../Helpers/ContextMenuOptions";
import formatTitle from "../../Helpers/FormatTitle";
import CustomIcon from "./Icons/CustomIcon";

import folderImage from "../../Images/folder.png";
import clickOnItem from "../../Helpers/ClickOnItem";
import { ffmpegThumbs } from "../../Helpers/FS and OS/FFmpeg";
import FFprobe from "../../Helpers/FS and OS/FFprobe";

const fs = window.require("fs");
const sharp = window.require("sharp");

let clickOnNameTimeout, mouseDownTimeout;
export default function FilesAndDirectories({
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
  } = directoryItem;

  const {
    dispatch,
    state: { currentDirectory, drive },
    renameItem,
    setRenameItem,
    settings: { singleClickToOpen, showThumbnails, iconSize },
  } = useContext(DirectoryContext);

  const [thumbnail, setThumbnail] = useState();
  const [metadata, setMetadata] = useState({});

  useEffect(() => {
    let timeout;
    if (isMedia) {
      if (currentDirectory !== "Trash") {
        fs.mkdirSync(
          `${drive}temp/${currentDirectory.slice(
            drive.length,
            currentDirectory.length
          )}`,
          { recursive: true }
        );
      }
      function createThumbnails() {
        if (filetype === "image") {
          sharp(path)
            .resize({ width: 400 })
            .toFile(thumbPath)
            .then(() => {
              setThumbnail(thumbPath);
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          ffmpegThumbs(path, thumbPath).then(() => {
            setThumbnail(thumbPath);
          });
        }
      }
      try {
        fs.accessSync(thumbPath);
        setThumbnail(thumbPath);
      } catch {
        if (currentDirectory === "Trash") {
          setThumbnail(drive + "trash/" + name);
          return;
        }
        timeout = setTimeout(() => {
          createThumbnails();
        }, 200);
      }
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [currentDirectory]);

  return (
    <button
      className={`display-page-block ${
        singleClickToOpen ? "single-click" : ""
      } ${iconSize}`}
      id={path}
      onMouseEnter={() => {
        if (isMedia) {
          FFprobe(path, filetype, setMetadata);
        }
      }}
      onMouseMove={() => {
        clearTimeout(mouseDownTimeout);
      }}
      onClick={() => {
        if (singleClickToOpen) {
          clickOnItem(directoryItem, dispatch);
        }
      }}
      onDoubleClick={(e) => {
        clearTimeout(clickOnNameTimeout);
        if (!permission || e.ctrlKey || e.shiftKey) {
          return;
        }
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
      onMouseDown={(e) => {
        if (e.button === 0 || e.button === 2) {
          if (!e.shiftKey && !e.ctrlKey) {
            clickOnNameTimeout = setTimeout(() => {
              setRenameItem(path);
            }, 1000);
          }
          mouseDownTimeout = setTimeout(() => {
            handleItemsSelected(
              e,
              selectedItems,
              setSelectedItems,
              lastSelected,
              setLastSelected
            );
          }, 100);
        }
      }}
      data-contextmenu={permission && contextMenuOptions(directoryItem)}
      data-info={permission && JSON.stringify({ ...directoryItem, path: path })}
      data-title={formatTitle(directoryItem, metadata)}
      data-destination={JSON.stringify({
        destination: path + "/",
      })}
    >
      {visibleItems.includes(document.getElementById(path)) && (
        <>
          {thumbnail && showThumbnails && isMedia ? (
            <div className="media-container">
              <img src={thumbnail} className="media-thumbnail" />
            </div>
          ) : (
            isFile && (
              <CustomIcon fileextension={fileextension.split(".")[1] || ""} />
            )
          )}
          {(isDirectory || isSymbolicLink) && (
            <img src={folderImage} alt="" className="block-icon" />
          )}
          <ItemName
            directoryItem={directoryItem}
            renameItem={renameItem}
            setRenameItem={setRenameItem}
          />
        </>
      )}
    </button>
  );
}

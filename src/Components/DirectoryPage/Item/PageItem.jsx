import { useContext, useState, useEffect } from "react";
import { GeneralContext } from "../../Main/Main.jsx";

import clickOnItem from "../../../Helpers/ClickOnItem";
import handleItemsSelected from "../../../Helpers/HandleItemsSelected";
import contextMenuOptions from "../../../Helpers/ContextMenuOptions";
import getVideoAtPercentage from "../../../Helpers/FS and OS/GetVideoAtPercentage.js";

import formatTitle from "../../../Helpers/FormatTitle";

import ItemName from "./ItemName.jsx";

import ItemContent from "./ItemContent.jsx";
import ViewsContent from "./ViewsContent.jsx";

const fs = window.require("fs");
const sharp = window.require("sharp");
const { execFile, execFileSync } = window.require("child_process");

let clickOnNameTimeout, selectTimeout, dragTimeout;
export default function PageItem({
  selectedItems: [selectedItems, setSelectedItems],
  lastSelected: [lastSelected, setLastSelected],
  detailsTabWidth,
  directoryItem,
  setDrag,
}) {
  const {
    path,
    isDirectory,
    permission,
    thumbPath,
    isMedia,
    filetype,
    isDrive,
    isSymbolicLink,
    linkTo,
  } = directoryItem;

  const {
    state: { currentDirectory },
    settings: { clickToOpen, showThumbnails },
    views: { iconSize, pageView, pageCompactView },
    dispatch,
    setRenameItem,
    renameItem,
    directoryItems,
  } = useContext(GeneralContext);

  const isSelected = selectedItems.includes(path);

  const [thumbnail, setThumbnail] = useState();

  useEffect(() => {
    let timeout;
    // setTimeout(() => {
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
              "./resources/ffmpeg.exe",
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
        }, directoryItems.indexOf(directoryItem) * 20);
      }
      timeout = setTimeout(() => {
        try {
          fs.accessSync(thumbPath);
          setThumbnail(thumbPath);
        } catch {
          createThumbnails();
        }
      }, directoryItems.indexOf(directoryItem) * 3);
    }
    // }, 0);
    return () => {
      clearTimeout(timeout);
    };
  }, [currentDirectory, showThumbnails]);

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
    if (isSelected) {
      clsName += " selected";
    }
    return clsName;
  }

  return (
    <div
      className={className()}
      id={path}
      style={{
        ...(pageView === "icon" && {
          width: iconSize + "rem",
          minHeight: iconSize + "rem",
        }),
      }}
      onMouseMove={(e) => {
        if (isSelected) {
          clearTimeout(selectTimeout);
        } else if (clickToOpen === "single") {
          clearTimeout(selectTimeout);
          selectTimeout = setTimeout(() => {
            handleItemsSelected(
              e,
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
          // prevent click through to page
          e.stopPropagation();
          selectTimeout = setTimeout(
            () => {
              handleItemsSelected(
                e,
                setSelectedItems,
                lastSelected,
                setLastSelected
              );
            },
            isSelected ? 200 : 0
          );
          if (isSelected) {
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
        if (clickToOpen === "single" && currentDirectory !== "Trash") {
          clickOnItem(directoryItem, dispatch);
        }
      }}
      onDoubleClick={(e) => {
        if (currentDirectory !== "Trash") {
          clearTimeout(clickOnNameTimeout);
          setRenameItem({});
          clickOnItem(directoryItem, dispatch);
        }
      }}
      onContextMenu={() => {
        clearTimeout(clickOnNameTimeout);
        setRenameItem({});
      }}
      data-contextmenu={contextMenuOptions(directoryItem)}
      data-info={permission && JSON.stringify({ ...directoryItem, path: path })}
      data-title={formatTitle(directoryItem)}
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
      {
        <ItemContent
          directoryItem={directoryItem}
          thumbnail={[thumbnail, setThumbnail]}
        />
      }
      <ItemName
        directoryItem={directoryItem}
        renameItem={renameItem}
        setRenameItem={setRenameItem}
        detailsTabWidth={detailsTabWidth}
      />
      {<ViewsContent directoryItem={directoryItem} />}
    </div>
  );
}

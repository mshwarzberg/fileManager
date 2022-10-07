import React, { useContext, useState, useEffect } from "react";
import { DirectoryContext } from "../Main/App";
import handleItemsSelected from "../../Helpers/HandleItemsSelected";
import ItemName from "./Icons/ItemName";
import contextMenuOptions from "../../Helpers/ContextMenuOptions";
import formatTitle from "../../Helpers/FormatTitle";
import CustomIcon from "./Icons/CustomIcon";

import folderImage from "../../Images/folder.png";
import clickOnItem from "../../Helpers/ClickOnItem";
import { ffmpegThumbs } from "../../Helpers/FS and OS/FFmpegFunctions";
import checkFileType from "../../Helpers/FS and OS/CheckFileType";

const exifr = window.require("exifr");
const fs = window.require("fs");
const sharp = window.require("sharp");
const { execSync } = window.require("child_process");

let clickOnNameTimeout;
export default function FilesAndDirectories({
  directoryItem,
  visibleItems,
  setSelectedItems,
  selectedItems,
  lastSelected,
  setLastSelected,
}) {
  const {
    location,
    name,
    isDirectory,
    isFile,
    permission,
    fileextension,
    thumbPath,
    isMedia,
  } = directoryItem;

  const { dispatch, state, renameItem, setRenameItem } =
    useContext(DirectoryContext);

  const [thumbnail, setThumbnail] = useState();
  const [metadata, setMetadata] = useState({});

  useEffect(() => {
    if (isMedia) {
      fs.mkdirSync(
        `${state.drive}temp/${state.currentDirectory.slice(
          state.drive.length,
          state.currentDirectory.length
        )}`,
        { recursive: true }
      );
      function createThumbnails() {
        if (checkFileType(name)[0] === "image") {
          sharp(location + name)
            .resize({ width: 400 })
            .toFile(thumbPath)
            .then(() => {
              setThumbnail(thumbPath);
            });
        } else {
          ffmpegThumbs(location + name, thumbPath).then(() => {
            setThumbnail(thumbPath);
          });
        }
      }
      try {
        fs.accessSync(thumbPath);
        setThumbnail(thumbPath);
      } catch {
        createThumbnails();
      }
    }
  }, []);

  return (
    <button
      className={`display-page-block ${
        selectedItems
          .map((item) => {
            return item.info.name;
          })
          .includes(name)
          ? "selected"
          : ""
      }`}
      id={location + name}
      onMouseEnter={() => {
        if (!metadata.width && isMedia) {
          const probeCommand = `ffprobe.exe -show_streams -print_format json "${
            location + name
          }"`;
          let output = execSync(probeCommand).toString();
          output = JSON.parse(output || "{}");
          const dimensions = output["streams"][0];
          setMetadata({
            width: dimensions.width,
            height: dimensions.height,
            duration: dimensions.duration > 1 && dimensions.duration,
          });
          if (fileextension === "jpg" || fileextension === "png") {
            exifr.parse(location + name, true).then((data) => {
              if (!data) {
                return;
              }
              const description =
                data.Comment || data.description?.value || data.description;
              setMetadata((prevData) => ({
                ...prevData,
                description: description,
              }));
            });
          }
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
              setRenameItem(location + name);
            }, 1000);
          }
          handleItemsSelected(
            e,
            selectedItems,
            setSelectedItems,
            lastSelected,
            setLastSelected
          );
          e.stopPropagation();
        }
      }}
      data-contextmenu={permission && contextMenuOptions(directoryItem)}
      data-info={
        permission &&
        JSON.stringify({ ...directoryItem, path: location + name })
      }
      data-title={formatTitle(directoryItem, metadata)}
      data-destination={
        isDirectory
          ? JSON.stringify({ destination: state.currentDirectory + name + "/" })
          : "{}"
      }
    >
      {visibleItems.includes(document.getElementById(location + name)) && (
        <>
          {thumbnail ? (
            <div className="media-container">
              <img src={thumbnail} className="media-thumbnail" />
            </div>
          ) : (
            isFile && <CustomIcon fileextension={fileextension} />
          )}
          {isDirectory && (
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

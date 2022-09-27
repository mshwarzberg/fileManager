import React, { useContext } from "react";
import { DirectoryContext } from "../Main/App";
import Media from "./Icons/Media";
import handleItemsSelected from "../../Helpers/HandleItemsSelected";
import ItemName from "./Icons/ItemName";
import contextMenuOptions from "../../Helpers/ContextMenuOptions";
import formatTitle from "../../Helpers/FormatTitle";
import CustomIcon from "./Icons/CustomIcon";

import folderImage from "../../Images/folder.png";
import checkFileType from "../../Helpers/FS and OS/CheckFileType";
import {
  ffmpegThumbs,
  ffprobeMetadata,
} from "../../Helpers/FS and OS/FFmpegFunctions";
import clickOnItem from "../../Helpers/ClickOnItem";

let clickOnNameTimeout;
export default function FilesAndDirectories({ directoryItem }) {
  const {
    path,
    location,
    name,
    isDirectory,
    isDrive,
    isFile,
    permission,
    isNetworkDrive,
    fileextension,
    thumbPath,
    isMedia,
  } = directoryItem;

  const {
    dispatch,
    itemsSelected,
    setItemsSelected,
    lastSelected,
    setLastSelected,
    state,
    setDirectoryItems,
    renameItem,
    setRenameItem,
  } = useContext(DirectoryContext);

  return (
    <button
      className="display-page-block"
      id={location + name}
      onMouseEnter={() => {
        if (isMedia) {
          ffprobeMetadata(location + name).then((data) => {
            setDirectoryItems((prevItems) =>
              prevItems.map((prevItem) => {
                if (prevItem.name === name) {
                  return {
                    ...prevItem,
                    ...data,
                  };
                }
                return prevItem;
              })
            );
          });
        }
      }}
      onMouseMove={(e) => {
        if (isMedia) {
          const date = Date.now();
          if (
            checkFileType(name)[0] === "video" ||
            checkFileType(name)[0] === "gif"
          ) {
            const templocation = `${
              state.drive
            }temp/${state.currentDirectory.slice(
              state.drive.length,
              state.currentDirectory.length
            )}`;
            ffmpegThumbs(
              location + name,
              templocation + date + "del.jpeg"
            ).then(() => {
              e.target.firstChild.firstChild.src =
                templocation + date + "del.jpeg";
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
      onClick={(e) => {
        if (!e.shiftKey && !e.ctrlKey) {
          clickOnNameTimeout = setTimeout(() => {
            setRenameItem(location + name);
          }, 1000);
        }
        handleItemsSelected(
          e,
          itemsSelected,
          setItemsSelected,
          lastSelected,
          setLastSelected
        );
        e.stopPropagation();
      }}
      data-contextmenu={permission && contextMenuOptions(directoryItem)}
      data-info={
        permission &&
        JSON.stringify({ ...directoryItem, path: location + name })
      }
      data-title={formatTitle(directoryItem)}
      data-destination={
        isDirectory
          ? JSON.stringify({ destination: state.currentDirectory + name + "/" })
          : "{}"
      }
    >
      {
        <>
          {thumbPath ? (
            <Media directoryItem={directoryItem} />
          ) : (
            isFile && <CustomIcon fileextension={fileextension} name={name} />
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
      }
    </button>
  );
}

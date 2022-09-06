import React, { useContext, useState } from "react";
import { DirectoryContext } from "../Main/App";
import Media from "./Icons/Media";
import handleItemsSelected from "../../Helpers/HandleItemsSelected";
import ItemName from "./Icons/ItemName";
import contextMenuOptions from "../../Helpers/ContextMenuOptions";
import formatTitle from "../../Helpers/FormatTitle";
import CustomIcon from "./Icons/CustomIcon";

import folderImage from "../../Images/folder.png";

const { exec } = window.require("child_process");

let clickOnNameTimeout;
export default function FilesAndDirectories({ directoryItem }) {
  const {
    path,
    name,
    isDirectory,
    isDrive,
    isFile,
    permission,
    isNetworkDrive,
    fileextension,
    thumbPath,
  } = directoryItem;

  const {
    dispatch,
    itemsSelected,
    setItemsSelected,
    lastSelected,
    setLastSelected,
    visibleItems,
  } = useContext(DirectoryContext);

  const [disabled, setDisabled] = useState(true);

  function clickOnItem() {
    if (isDrive) {
      dispatch({
        type: "open",
        value: path,
      });
      dispatch({
        type: "drive",
        value: path,
      });
      if (isNetworkDrive) {
        dispatch({
          type: "addNetworkDrive",
          value: path,
        });
      }
    } else if (isFile) {
      exec(`"${path + name}"`);
    } else if (isDirectory) {
      dispatch({
        type: "open",
        value: path + name + "/",
      });
    } else {
      console.log("?");
    }
  }

  return (
    <button
      className="display-page-block"
      id={name}
      onDoubleClick={(e) => {
        clearTimeout(clickOnNameTimeout);
        if (!permission || e.ctrlKey || e.shiftKey) {
          return;
        }
        clickOnItem();
      }}
      onContextMenu={() => {
        clearTimeout(clickOnNameTimeout);
        setDisabled(true);
      }}
      onBlur={(e) => {
        if (e.relatedTarget?.className !== "block-name") {
          setDisabled(true);
        }
      }}
      onClick={(e) => {
        if (!e.shiftKey && !e.ctrlKey) {
          clickOnNameTimeout = setTimeout(() => {
            setDisabled(false);
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
        permission && JSON.stringify({ ...directoryItem, path: path + name })
      }
      data-title={formatTitle(directoryItem)}
    >
      {visibleItems.includes(document.getElementById(name)) && (
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
            disabled={disabled}
            setDisabled={setDisabled}
          />
        </>
      )}
    </button>
  );
}

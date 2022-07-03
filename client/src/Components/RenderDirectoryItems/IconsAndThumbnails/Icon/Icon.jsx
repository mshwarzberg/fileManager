import React, { useContext, useEffect, useRef } from "react";
import { DirectoryContext } from "../../../Main/App";
import folder from "../../../../Assets/images/folder.png";
import symlink from "../../../../Assets/images/symlink.png";
import drive from "../../../../Assets/images/drive.png";
import Filename from "./Filename";
import CustomIcon from "./CustomIcon";
import useDrag from "../../../../Hooks/useDrag";

function Icon(props) {
  const {
    dispatch,
    directoryItems,
    state,
    setDirectoryItems,
    setControllers,
    controllers,
  } = useContext(DirectoryContext);

  const { item, index, getTitle } = props;

  const {
    name,
    fileextension,
    thumbnail,
    isFile,
    permission,
    path,
    linkTo,
    isSymbolicLink,
    isDirectory,
    isDrive,
  } = item;

  const blockRef = useRef();
  const { XY, setIsDragging } = useDrag(blockRef.current, false, true);

  function fetchStuff() {
    const controller = new AbortController();
    setControllers((prevControllers) => [...prevControllers, controller]);
    fetch("/api/data/thumbs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prefix: item.prefix,
        suffix: item.fileextension,
        currentdirectory: state.currentDirectory,
        drive: state.drive,
      }),
      signal: controller.signal,
    })
      .then(async (res) => {
        let response = await res.blob();
        let imageURL = URL.createObjectURL(response);

        setDirectoryItems((prevItems) => {
          return prevItems.map((prevItem) => {
            const doesMatch =
              res.headers.get("prefix") === prevItem.prefix &&
              res.headers.get("suffix") === prevItem.fileextension;
            const newData = {
              ...prevItem,
              ...(doesMatch && {
                thumbnail: imageURL,
                width: res.headers.get("width"),
                height: res.headers.get("height"),
                ...(res.headers.get("duration") && {
                  duration: res.headers.get("duration"),
                }),
              }),
            };

            sessionStorage.setItem(
              path,
              JSON.stringify({
                thumbnail: imageURL,
                width: res.headers.get("width"),
                height: res.headers.get("height"),
                duration: res.headers.get("duration"),
              })
            );
            return newData;
          });
        });
      })
      .catch((err) => {
        if (!err.toString().includes("AbortError")) {
          console.log("App.jsx, Thumbnail", err.toString());
        }
      });
  }

  useEffect(() => {
    if (
      item.itemtype === "video" ||
      item.itemtype === "image" ||
      item.itemtype === "gif"
    ) {
      if (!thumbnail) {
        if (sessionStorage.getItem(path)) {
          return setDirectoryItems((prevItems) => {
            return prevItems.map((prevItem) => {
              if (path === prevItem.path) {
                return {
                  ...prevItem,
                  ...JSON.parse(sessionStorage.getItem(path)),
                };
              }
              return prevItem;
            });
          });
        }
        fetchStuff();
      }
    }
    // if items with the same name are in different folders and the AbortController is called, there wouldn't be a new request made for the item causing the thubmnail to not load, so I added the item path as a dependency to check if the item changed.

    // eslint-disable-next-line
  }, [thumbnail, path]);

  function displayIcon() {
    if (isFile) {
      return (
        <CustomIcon
          fileextension={fileextension}
          index={index}
          permission={permission}
          getTitle={getTitle}
        />
      );
    }
    if (isDirectory || isSymbolicLink) {
      return (
        <img
          src={
            isSymbolicLink
              ? localStorage.getItem("symlink") || symlink
              : localStorage.getItem("folder") || folder
          }
          alt="foldericon"
          data-path={!isSymbolicLink && permission ? path : ""}
          data-index={
            !isSymbolicLink && permission ? directoryItems.indexOf(item) : ""
          }
          className="renderitem--full-icon"
          data-title={getTitle()}
          onClick={() => {
            for (let i in controllers) {
              controllers[i].abort();
            }
            setControllers([]);
          }}
        />
      );
    }
    if (isDrive) {
      return (
        <img src={drive} alt="fileicon" className="renderitem--full-icon" />
      );
    }
  }

  return (
    <div
      className="renderitem--block"
      onClick={() => {
        if (isDirectory && permission && !isSymbolicLink) {
          dispatch({
            type: "openDirectory",
            value: path,
          });
        }
        if (isSymbolicLink && permission) {
          dispatch({
            type: "openDirectory",
            value: `${linkTo}`,
          });
        }
      }}
      data-name={name}
      style={{
        cursor: !permission ? "not-allowed" : "pointer",
        backgroundColor: !permission ? "#ff7878c5" : "",
        border: !permission ? "1.5px solid red" : "",
        ...((XY.x || XY.y) && {
          top: XY.y,
          left: XY.x,
          zIndex: 100,
          pointerEvents: "none",
          backgroundColor: "black",
          border: "2px solid pink",
          opacity: 0.8,
        }),
      }}
      onMouseDown={(e) => {
        if (e.button === 0) {
          setIsDragging(true);
          e.stopPropagation();
          return;
        }
      }}
      ref={blockRef}
    >
      {displayIcon()}
      <Filename name={name} />
    </div>
  );
}

export default Icon;

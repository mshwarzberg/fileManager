import React, { useContext, useEffect } from "react";
import { DirectoryContext } from "../../../Main/App";
import folder from "../../../../Assets/images/folder.png";
import symlink from "../../../../Assets/images/symlink.png";
import drive from "../../../../Assets/images/drive.png";
import Filename from "./Filename";
import CustomIcon from "./CustomIcon";

function Icon(props) {
  const { dispatch, state, setDirectoryItems, setControllers, controllers } =
    useContext(DirectoryContext);

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
    itemtype,
    prefix,
  } = props.item;

  function fetchStuff() {
    const controller = new AbortController();
    setControllers((prevControllers) => [...prevControllers, controller]);
    fetch("/api/getthumbnails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prefix: prefix,
        suffix: fileextension,
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
    if (itemtype === "video" || itemtype === "image" || itemtype === "gif") {
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
      return <CustomIcon fileextension={fileextension} />;
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
          className="renderitem--full-icon"
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
      className="block-container"
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
    >
      {displayIcon()}
      <Filename name={name} />
    </div>
  );
}

export default Icon;

import React, { useContext } from "react";
import { GeneralContext } from "../../../Main/App";
import folder from "../../../../Assets/images/folder.png";
import symlink from "../../../../Assets/images/symlink.png";
import drive from "../../../../Assets/images/drive.png";
import Filename from "./Filename";
import CustomIcon from "./CustomIcon";

function Icon(props) {
  const { dispatch, setControllers, controllers } = useContext(GeneralContext);

  const {
    name,
    fileextension,
    isFile,
    permission,
    path,
    linkTo,
    isSymbolicLink,
    isDirectory,
    isDrive,
  } = props.item;

  // function fetchStuff() {
  //   const controller = new AbortController();
  //   setControllers((prevControllers) => [...prevControllers, controller]);
  //   fetch("/api/mediametadata", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       prefix: prefix,
  //       fileextension: fileextension,
  //       currentdirectory: state.currentDirectory,
  //       drive: state.drive,
  //     }),
  //     signal: controller.signal,
  //   })
  //     .then(async (res) => {
  //       const response = await res.json();
  //       setDirectoryItems((prevItems) => {
  //         return prevItems.map((prevItem) => {
  //           if (
  //             prevItem.prefix === response.prefix &&
  //             prevItem.fileextension === response.fileextension
  //           ) {
  //             return {
  //               ...prevItem,
  //               ...response,
  //             };
  //           }
  //           return prevItem;
  //         });
  //       });
  //     })
  //     .catch((err) => {
  //       if (!err.toString().includes("AbortError")) {
  //         console.log("App.jsx, Thumbnail", err.toString());
  //       }
  //     });
  // }

  function displayIcon() {
    if (isFile) {
      return <CustomIcon fileextension={fileextension} />;
    }
    if (isDirectory || isSymbolicLink) {
      return (
        <img
          src={isSymbolicLink ? symlink : folder}
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
            value: path + "/",
          });
        }
        if (isSymbolicLink && permission) {
          dispatch({
            type: "openDirectory",
            value: linkTo + "/",
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

import { useContext, useEffect, useState } from "react";
import { GeneralContext } from "../Main/App.jsx";
import contextMenuOptions from "../../Helpers/ContextMenuOptions";
import { findInArray } from "../../Helpers/SearchArray";
import CornerInfo from "./CornerInfo";
import { bitRateToInt } from "../../Helpers/FormatBitRate.js";

const { exec } = window.require("child_process");

export default function Page({
  selectedItems,
  setVisibleItems,
  clipboard,
  children,
}) {
  const {
    setDirectoryItems,
    directoryItems,
    state: { currentDirectory },
    settings: { appTheme },
  } = useContext(GeneralContext);

  const [rerender, setRerender] = useState(false);

  function handleVisibleItems() {
    const elements = document.getElementsByClassName("display-page-block");
    setVisibleItems([]);
    for (const element of elements) {
      const elementDimensions = element.getBoundingClientRect();

      const notAboveScreen =
        elementDimensions.top + elementDimensions.height >= 0;
      const notBelowScreen = elementDimensions.top < window.innerHeight;
      if (notBelowScreen && notAboveScreen) {
        setVisibleItems((prevVisible) => [...prevVisible, element]);
      }
      if (!notBelowScreen) {
        break;
      }
    }
  }

  useEffect(() => {
    const pageBlocks = document.getElementsByClassName("display-page-block");
    function focusPage(e) {
      for (const element of pageBlocks) {
        if (findInArray(selectedItems, element, "element")) {
          element.classList.add("selected");
          element.classList.remove("alternate");
        } else {
          element.classList.remove("selected");
          element.classList.remove("alternate");
        }
      }
    }
    focusPage();
    function blurredPage() {
      for (const element of pageBlocks) {
        if (findInArray(selectedItems, element, "element")) {
          element.classList.add("selected");
          element.classList.add("alternate");
        } else {
          element.classList.remove("selected");
          element.classList.remove("alternate");
        }
      }
    }
    window.addEventListener("blur", blurredPage);
    window.addEventListener("focus", focusPage);
    return () => {
      window.removeEventListener("blur", blurredPage);
      window.removeEventListener("focus", focusPage);
    };
  }, [selectedItems]);

  useEffect(() => {
    handleVisibleItems();
  }, [directoryItems]);

  useEffect(() => {
    if (rerender) {
      const cmd = `powershell.exe ./MediaMetadata.ps1 """${currentDirectory}"""`;
      function videoTimeToNum(str) {
        if (!str) {
          return "";
        }
        str = str.split(":");
        let value = 0;
        value += parseInt(str[2]);
        value += parseInt(str[1]) * 60;
        value += parseInt(str[0]) * 3600;
        return value;
      }

      function clearString(str) {
        if (!str) {
          return "";
        }
        return str.replaceAll(" pixels", "").replaceAll("?", "");
      }

      exec(cmd, (error, duration) => {
        if (error) console.log(error);
        try {
          let formattedDuration = duration?.replaceAll("\\r\\n", "");
          formattedDuration = JSON.parse(duration || "[]");
          setDirectoryItems((prevItems) =>
            prevItems.map((prevItem) => {
              let metadata;
              if (typeof formattedDuration === "object") {
                for (let item of formattedDuration) {
                  metadata = JSON.parse(item);
                  const {
                    duration,
                    name,
                    width,
                    height,
                    dimensions,
                    description,
                    bitrate,
                  } = metadata;

                  if (name === prevItem.name) {
                    return {
                      ...prevItem,
                      duration: videoTimeToNum(duration),
                      width: parseInt(clearString(width)),
                      height: parseInt(clearString(height)),
                      ...(dimensions && {
                        dimensions: clearString(dimensions),
                      }),
                      ...(description && { description: description }),
                      ...(bitrate && {
                        bitrate: bitRateToInt(clearString(bitrate)),
                      }),
                    };
                  }
                }
              } else if (typeof formattedDuration === "string") {
                metadata = JSON.parse(formattedDuration);
                const {
                  name,
                  width,
                  height,
                  dimensions,
                  description,
                  bitrate,
                  duration,
                } = metadata;
                if (name === prevItem.name) {
                  return {
                    ...prevItem,
                    duration: videoTimeToNum(duration),
                    width: parseInt(clearString(width)),
                    height: parseInt(clearString(height)),
                    dimensions: clearString(dimensions),
                    ...(description && { description: description }),
                    ...(bitrate && {
                      bitrate: bitRateToInt(clearString(bitrate)),
                    }),
                  };
                }
              }
              return prevItem;
            })
          );
        } catch (error) {
          console.error(error);
        }
      });
    }
    setRerender(true);
    // eslint-disable-next-line
  }, [rerender, currentDirectory]);

  return (
    <div
      className={`page-${appTheme}`}
      id="display-page"
      onScroll={() => {
        handleVisibleItems();
      }}
      data-contextmenu={contextMenuOptions()}
      data-info={JSON.stringify({
        isDirectory: true,
        path: currentDirectory,
      })}
      data-destination={currentDirectory}
    >
      <div id="select-multiple-box" />
      {children}
      {!directoryItems.length && (
        <h1 id="empty-directory-header">
          {currentDirectory === "Trash" ? "Trash" : "Folder"} is empty
        </h1>
      )}
      <CornerInfo
        clipboard={clipboard}
        selectedItems={selectedItems}
        directoryItems={directoryItems}
      />
    </div>
  );
}

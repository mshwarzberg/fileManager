import { useContext, useEffect, useState } from "react";
import { GeneralContext } from "../Main/Main.jsx";
import contextMenuOptions from "../../Helpers/ContextMenuOptions";
import CornerInfo from "./CornerInfo";
import { bitRateToInt } from "../../Helpers/FormatBitRate.js";
import { durationToInt } from "../../Helpers/FormatVideoTime.js";

const { exec } = window.require("child_process");
const fs = window.require("fs");

export default function Page({
  selectedItems: [selectedItems, setSelectedItems],
  clipboard,
  children,
  reload,
  loading,
  setLastSelected,
}) {
  const {
    setDirectoryContent,
    directoryContent,
    directoryState: { currentDirectory },
    views: { appTheme, pageView },
  } = useContext(GeneralContext);

  const [metadata, setMetadata] = useState([]);
  const [infoHeader, setInfoHeader] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem(currentDirectory)) {
      setMetadata(
        JSON.parse(sessionStorage.getItem(currentDirectory) || "[]").map(
          (data) => JSON.parse(data)
        )
      );
    } else if (currentDirectory !== "Trash") {
      exec(
        `.\\resources\\exiftool.exe -j "${currentDirectory}"`,
        (err, data) => {
          if (err) return console.log(err);
          const formattedMetadata = JSON.parse(data || "[]").map((item) => {
            // console.log(item);
            return {
              path: item.SourceFile,
              width: item.ImageWidth,
              height: item.ImageHeight,
              bitrate: bitRateToInt(item.AvgBitrate),
              duration: durationToInt(item.Duration),
              dimensions: item.ImageSize,
              description: item.Description,
            };
          });
          setMetadata(formattedMetadata);
          sessionStorage.setItem(
            currentDirectory,
            JSON.stringify(
              formattedMetadata.map((item) => JSON.stringify(item))
            )
          );
        }
      );
    }
  }, [currentDirectory, reload]);

  useEffect(() => {
    setDirectoryContent((prevItems) =>
      prevItems.map((prevItem) => {
        for (const data of metadata) {
          if (data.path === prevItem.path) {
            return {
              ...prevItem,
              ...data,
            };
          }
        }
        return prevItem;
      })
    );
  }, [metadata]);

  useEffect(() => {
    if (loading) {
      setInfoHeader("Loading");
    } else if (!directoryContent.length) {
      setInfoHeader(
        (currentDirectory === "Trash" ? "Trash" : "Folder") + " is empty"
      );
    } else {
      setInfoHeader("");
    }
  }, [loading, directoryContent, currentDirectory]);

  useEffect(() => {
    if (
      directoryContent.map((item) => item.isMedia).includes(true) &&
      currentDirectory !== "Trash" &&
      currentDirectory !== ""
    ) {
      fs.mkdirSync(currentDirectory + "$Thumbs$", { recursive: true });
      exec(`attrib +s +h "${currentDirectory}$Thumbs$"`);
    }
  }, [currentDirectory, reload]);

  function pageClassName() {
    let className = `page-${appTheme} page-${pageView}-view `;
    if (
      infoHeader &&
      infoHeader !==
        (currentDirectory === "Trash" ? "Trash" : "Folder") + " is empty"
    ) {
      return className + "page-loading";
    }
    return className;
  }
  return (
    <div
      className={pageClassName()}
      id="display-page"
      onMouseDown={(e) => {
        if (!e.shiftKey && !e.ctrlKey && e.clientX < window.innerWidth - 12) {
          setSelectedItems([]);
          setLastSelected();
        }
      }}
      data-contextmenu={contextMenuOptions()}
      data-info={JSON.stringify({
        isDirectory: true,
        path: currentDirectory,
      })}
      data-destination={currentDirectory}
    >
      <div id="select-multiple-box" />
      {!infoHeader && children}
      {infoHeader && <h1 id="page-info-header">{infoHeader}</h1>}
      <CornerInfo
        clipboard={clipboard}
        selectedItems={selectedItems}
        directoryContent={directoryContent}
      />
    </div>
  );
}

import { useContext, useEffect, useState } from "react";
import { GeneralContext } from "../Main/Main.jsx";
import contextMenuOptions from "../../Helpers/ContextMenuOptions";
import CornerInfo from "./CornerInfo";
import { bitRateToInt } from "../../Helpers/FormatBitRate.js";

const { exec } = window.require("child_process");
const fs = window.require("fs");

export default function Page({
  selectedItems: [selectedItems, setSelectedItems],
  clipboard,
  children,
  reload,
  loading: [loading, setLoading],
  setLastSelected,
}) {
  const {
    setDirectoryItems,
    directoryItems,
    state: { currentDirectory },
    views: { appTheme, pageView },
  } = useContext(GeneralContext);

  const [metadata, setMetadata] = useState([]);
  const [InfoHeader, setInfoHeader] = useState("");

  useEffect(() => {
    const cmd = `powershell.exe ./Misc/PS1Scripts/MediaMetadata.ps1 """${currentDirectory}"""`;

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
    if (sessionStorage.getItem(currentDirectory)) {
      setMetadata(
        JSON.parse(sessionStorage.getItem(currentDirectory) || "[]").map(
          (data) => JSON.parse(data)
        )
      );
    } else if (currentDirectory !== "Trash") {
      exec(cmd, (error, output) => {
        if (error) console.log(error);
        let formattedMetadata = output?.replaceAll("\\r\\n", "");
        try {
          formattedMetadata = JSON.parse(output || "[]").map((data) => {
            const {
              name,
              width,
              height,
              dimensions,
              description,
              bitrate,
              duration,
            } = JSON.parse(data);

            return {
              name: name,
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
          });
        } catch {
          const {
            name,
            duration,
            width,
            height,
            dimensions,
            description,
            bitrate,
          } = JSON.parse(JSON.parse(formattedMetadata || "{}") || "{}");

          formattedMetadata = [
            {
              name: name,
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
            },
          ];
        }

        sessionStorage.setItem(
          currentDirectory,
          JSON.stringify(formattedMetadata.map((data) => JSON.stringify(data)))
        );
        setMetadata(formattedMetadata);
      });
    }
  }, [currentDirectory, reload]);

  useEffect(() => {
    setDirectoryItems((prevItems) =>
      prevItems.map((prevItem) => {
        for (const data of metadata) {
          if (data.name === prevItem.name) {
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
    } else if (!directoryItems.length) {
      setInfoHeader(
        (currentDirectory === "Trash" ? "Trash" : "Folder") + " is empty"
      );
    } else {
      setInfoHeader("");
    }
  }, [loading, directoryItems, currentDirectory]);

  useEffect(() => {
    if (
      directoryItems.map((item) => item.isMedia).includes(true) &&
      currentDirectory !== "Trash" &&
      currentDirectory !== ""
    ) {
      fs.mkdirSync(currentDirectory + "$Thumbs$", { recursive: true });
      exec(`attrib +s +h "${currentDirectory}$Thumbs$"`);
    }
  }, [currentDirectory, reload]);

  return (
    <div
      className={`page-${appTheme} page-${pageView}-view ${
        InfoHeader ? "page-loading" : ""
      }`}
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
      {!InfoHeader && children}
      {InfoHeader && <h1 id="page-info-header">{InfoHeader}</h1>}
      <CornerInfo
        clipboard={clipboard}
        selectedItems={selectedItems}
        directoryItems={directoryItems}
      />
    </div>
  );
}

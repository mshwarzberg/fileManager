import React, { useEffect, useState, useContext } from "react";
import { GeneralContext } from "../../Main/App";
import formatMetadata from "../../../Helpers/FS and OS/FormatMetadata";
import CustomFileIcon from "./CustomFileIcon";
import randomIntBetweenTwoNums from "../../../Helpers/RandomIntBetweenTwoNums";

const fs = window.require("fs");

export default function CustomFolderIcon({ directoryPath }) {
  const [innerContent, setInnerContent] = useState();
  const [isDirectoryEmpty, setIsDirectoryEmpty] = useState();

  const {
    settings: { showThumbnails },
  } = useContext(GeneralContext);

  const drive = directoryPath.slice(0, 3);
  useEffect(() => {
    try {
      const content = fs
        .readdirSync(directoryPath, {
          withFileTypes: true,
        })
        .map((file) => {
          return formatMetadata(file, directoryPath, drive);
        })
        .filter((item) => item.isFile && item);

      if (
        content.length === 0 ||
        !content.map((item) => item.isFile).includes(true) ||
        !showThumbnails
      ) {
        setIsDirectoryEmpty(fs.readdirSync(directoryPath).length === 0);
      } else {
        const randomFromFolder =
          content[randomIntBetweenTwoNums(0, content.length)];
        try {
          fs.accessSync(randomFromFolder.thumbPath);
          setInnerContent(
            <image
              key={randomFromFolder.key}
              href={randomFromFolder.thumbPath}
              width="50"
              height="50"
              x={25}
              y={20}
            />
          );
        } catch (error) {
          setInnerContent(
            <CustomFileIcon
              fileextension={randomFromFolder.fileextension.split(".")[1]}
              key={randomFromFolder.key}
              viewBox={200}
              x={-50}
              y={-25}
            />
          );
        }
      }
    } catch (error) {}
  }, [directoryPath, showThumbnails]);

  return (
    <svg viewBox="0 0 100 90">
      <>
        <rect
          name="top-right-dark-corner"
          width="15"
          height="40"
          x="75"
          y="18"
          rx="4"
          fill="rgb(218, 156, 18)"
        />
        <rect
          name="top-of-folder"
          fill="rgb(253, 191, 33)"
          width="75"
          height="60"
          x="10"
          y="9"
          clipPath="polygon(40% 0, 55% 15%, 96% 15%, 100% 23%, 100% 100%, 0 100%, 0 0)"
          rx="4"
        />
        <circle cx="82.1" cy="21" r="3" fill="rgb(253, 191, 33)" />
      </>
      {innerContent
        ? innerContent
        : !isDirectoryEmpty && (
            <>
              <rect
                width="70"
                height="30"
                x="15"
                y="23"
                fill="rgb(202, 238, 235)"
                name="lighter-sky-blue"
              />
              <rect
                width="70"
                height="30"
                x="15"
                y="28"
                fill="white"
                name="paper-white"
              />
              <rect
                width="5"
                height="5"
                fill="skyblue"
                x="80"
                y="23"
                name="darker-sky-blue"
              />
            </>
          )}
      <>
        <rect
          width="78"
          height="8"
          rx="4"
          x="11"
          y="73"
          fill="rgb(253, 191, 33)"
          style={{ filter: "drop-shadow( 2px 3px 1px rgba(0, 0, 0, .7))" }}
          name="bottom-of-folder"
        />
        <rect
          width="15"
          height={innerContent && !isDirectoryEmpty ? "34" : "54"}
          x="75"
          y={innerContent && !isDirectoryEmpty ? "47.5" : "27.5"}
          fill="rgb(253, 191, 33)"
          rx="4"
          name="right-of-folder"
          style={{ filter: "drop-shadow( 2px 2px 0.3rem black)" }}
        />
        <rect
          fill="rgb(255, 208, 107)"
          width="75"
          height={innerContent && !isDirectoryEmpty ? "34" : "54"}
          x="10"
          y={innerContent && !isDirectoryEmpty ? "47.5" : "27.5"}
          clipPath="polygon(4% 19%, 50% 19%, 63% 0, 100% 0, 100% 100%, 0 100%, 0 24%)"
          rx="4"
          name="bottom-left-of-folder"
        />
        <rect
          width="5"
          height="5"
          fill="rgb(255, 208, 107)"
          x="80"
          y={innerContent && !isDirectoryEmpty ? "47.5" : "27.5"}
          name="right-sharpened-corner"
        />
        <circle
          cx="13.1"
          cy={innerContent && !isDirectoryEmpty ? "56.9" : "40.7"}
          r="3"
          fill="rgb(255, 208, 107)"
        />
      </>
    </svg>
  );
}

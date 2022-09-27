import React, { useState, useContext, useEffect, useRef } from "react";

import formatVideoTime from "../../../Helpers/FormatVideoTime";
import checkFileType from "../../../Helpers/FS and OS/CheckFileType";
import {
  ffmpegThumbs,
  ffprobeMetadata,
} from "../../../Helpers/FS and OS/FFmpegFunctions";
import { DirectoryContext } from "../../Main/App";

const fs = window.require("fs");
const sharp = window.require("sharp");

export default function Media({ directoryItem }) {
  const { name, thumbPath, location, size } = directoryItem;

  const { state, setDirectoryItems, directoryItems } =
    useContext(DirectoryContext);

  const [thumbnail, setThumbnail] = useState();
  const [mediaData, setMediaData] = useState({});

  const { duration } = mediaData;
  useEffect(() => {
    fs.mkdirSync(
      `${state.drive}temp/${state.currentDirectory.slice(
        state.drive.length,
        state.currentDirectory.length
      )}`,
      { recursive: true }
    );
    function createThumbnails() {
      setTimeout(() => {
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
          ffprobeMetadata(location + name, (data) => {
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
      }, directoryItems.indexOf(directoryItem) * 100);
    }
    try {
      fs.accessSync(thumbPath);
      setThumbnail(thumbPath);
    } catch {
      setTimeout(() => {
        createThumbnails();
      }, directoryItems.indexOf(directoryItem) * 100);
    }
  }, [state.currentDirectory]);

  useEffect(() => {
    setTimeout(async () => {
      const data = await ffprobeMetadata(location + name);
      setMediaData(data);
    }, directoryItems.indexOf(directoryItem) * 100);
  }, []);

  return (
    <div className="media-container">
      <img src={thumbnail} className="media-thumbnail" />
      {duration && thumbnail ? (
        <>
          <p className="duration">{formatVideoTime(duration)}</p>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

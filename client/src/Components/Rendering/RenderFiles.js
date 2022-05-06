import React, { useEffect, useContext, useState } from "react";

// context import
import { DirectoryContext } from "../../App";
// component import
import ImageGif from "./RenderIconsAndThumbnails/ImageGif";
import Video from "./RenderIconsAndThumbnails/Video";
import Icon from "./RenderIconsAndThumbnails/Icon";

import VideoDisplay from "../ItemDisplay/VideoDisplay";
import DocumentDisplay from "../ItemDisplay/DocumentDisplay";
import ImageDisplay from "../ItemDisplay/ImageDisplay";

function RenderFiles(props) {
  const { itemsInDirectory, setNavigatedDirs } = props;

  const { setCurrentDir, currentDir } = useContext(DirectoryContext);

  const [viewItem, setViewItem] = useState({
    type: null,
    property: null,
    index: null,
    name: null,
  });

  useEffect(() => {
    function navigateImagesAndVideos(e) {
      if (
        e.key !== "ArrowRight" &&
        e.key !== "ArrowLeft" &&
        e.key !== " " &&
        e.key !== "Escape"
      ) {
        return;
      }
      if (viewItem.property) {
        let direction;
        if (e.key === "ArrowRight" || e.key === " ") {
          direction = "forwards";
        }
        if (e.key === "ArrowLeft") {
          direction = "backwards";
        }
        changeFolderOrViewFiles(
          viewItem.type,
          viewItem.name,
          viewItem.index,
          direction
        );
      }
    }
    document.addEventListener("keydown", navigateImagesAndVideos);
    return () => {
      document.removeEventListener("keydown", navigateImagesAndVideos);
    };
  });

  function renderViewItem(type, property, index, filename) {
    if (type === "video") {
      return setViewItem({
        type: "video",
        property: property,
        index: index,
        name: filename,
      });
    } else if (type === "image" || type === "gif" || type === "document") {
      fetch(`/api/loadfiles/file`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: filename,
          type: type,
        }),
      })
        .then(async (res) => {
          const response = await res.blob();

          if (res.headers.get("type") === "imagegif") {
            const imageURL = URL.createObjectURL(response);
            return setViewItem({
              type: "imagegif",
              property: imageURL,
              index: index,
              name: filename,
            });
          } else {
            const reader = new FileReader();

            reader.onload = function () {
              setViewItem({
                type: "document",
                property: reader.result,
                index: index,
                name: filename,
              });
            };
            reader.readAsBinaryString(response);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function changeFolderOrViewFiles(type, filename, index, direction) {
    if (direction) {
      if (direction === "forwards") {
        for (let i = index + 1; i < itemsInDirectory.length; i++) {
          type = itemsInDirectory[i].itemtype;
          if (type === "video" || type === "image" || type === "document") {
            filename = itemsInDirectory[i].name;
            index = i;
            break;
          }
        }
      } else if (direction === "backwards") {
        for (let i = index - 1; i > 0; i--) {
          type = itemsInDirectory[i].itemtype;
          if (type === "video" || type === "image" || type === "document") {
            filename = itemsInDirectory[i].name;
            index = i;
            break;
          }
        }
      }
    }

    if (type === "folder") {
      setCurrentDir((prevDir) => `${prevDir}/${filename}`);
      setNavigatedDirs(prevNavDirs => {
        return {
          array: [...prevNavDirs.array, `${currentDir}/${filename}`],
          index: prevNavDirs.index + 1,
        }
      })
    } else {
      // setting a 'default' property since the video is the only property that will not use fetch. If the type is not video the property will be overridden later on.
      return renderViewItem(
        type,
        `/api/loadfiles/playvideo/${filename}`,
        index,
        filename
      );
    }
  }

  // render the file data and thumbnails
  const renderItems = itemsInDirectory.map((item) => {
    const { name, fileextension, size } =
      item;
    if (name) {
      return (
        <div
          key={`Name: ${name}\nSize: ${size}\nType: ${fileextension}`}
        >
          <ImageGif
            itemsInDirectory={itemsInDirectory}
            changeFolderOrViewFiles={changeFolderOrViewFiles}
            item={item}
            />
          <Video
            itemsInDirectory={itemsInDirectory}
            changeFolderOrViewFiles={changeFolderOrViewFiles}
            item={item}
            />
          <Icon
            itemsInDirectory={itemsInDirectory}
            changeFolderOrViewFiles={changeFolderOrViewFiles}
            item={item}
          />
        </div>
      );
    }
    return "";
  });
  return (
    <div id="renderfile--page">
      {renderItems}
      <VideoDisplay viewItem={viewItem} setViewItem={setViewItem} />
      <DocumentDisplay viewItem={viewItem} setViewItem={setViewItem} />
      <ImageDisplay viewItem={viewItem} setViewItem={setViewItem} />
    </div>
  );
}

export default RenderFiles;

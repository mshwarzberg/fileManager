import React, { useEffect, useContext } from "react";
import { DirectoryContext } from "../App";

import folderIcon from "../images/folder.png";
import gifIcon from "../images/gif.png";
import videoIcon from "../images/film.png";
import documentIcon from "../images/document.png";
import imageIcon from "../images/image.png";
import unknownIcon from "../images/unknownfile.png";
import playIcon from "../images/play.png";

import lightFolderIcon from "../images/folderhover.png";
import lightGifIcon from '../images/gifhover.png'
import lightVideoIcon from "../images/filmhover.png";
import lightDocumentIcon from "../images/documenthover.png";
import lightImageIcon from "../images/imagehover.png";
import lightUnknownIcon from "../images/unknownfilehover.png";
import lightPlayIcon from "../images/playhover.png";

function RenderFiles(props) {
  const { itemsInDirectory, setCurrentIndex, clear, setViewItem, viewItem } =
    props;

  const { setCurrentDir } = useContext(DirectoryContext);

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
        if (e.key === "Escape") {
          clear();
          return;
        }
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
    if (type === "videoIcon") {
      return setViewItem({
        type: "videoIcon",
        property: property,
        index: index,
        name: filename,
      });
    } else if (
      type === "imageIcon" ||
      type === "gifIcon" ||
      type === "documentIcon"
    ) {
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

          if (res.headers.get("type") === "image") {
            const imageURL = URL.createObjectURL(response);
            return setViewItem({
              type: "imageIcon",
              property: imageURL,
              index: index,
              name: filename,
            });
          } else {
            const reader = new FileReader();

            reader.onload = function () {
              setViewItem({
                type: "documentIcon",
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
          type = itemsInDirectory[i].itemtype
          if (
            type === "videoIcon" ||
            type === "imageIcon" ||
            type === "documentIcon"
          ) {
            filename = itemsInDirectory[i].name;
            index = i;
            break;
          }
        }
      } else if (direction === "backwards") {
        for (let i = index - 1; i > 0; i--) {
          type = itemsInDirectory[i].itemtype
          if (
            type === "videoIcon" ||
            type === "imageIcon" ||
            type === "documentIcon"
          ) {
            filename = itemsInDirectory[i].name;
            index = i;
            break;
          }
        }
      }
    }

    clear();

    if (type === "folderIcon") {
      setCurrentDir((prevDir) => `${prevDir}/${filename}`);
      setCurrentIndex(0);
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

  function sliceName(name) {
    if (name.slice(0, 25) < name) {
      return name.slice(0, 25) + "...";
    }
    return name.slice(0, 25);
  }

  // render the file data and thumbnails
  const renderItems = itemsInDirectory.map((item) => {
    const { itemtype, name, fileextension, size, thumbnail, shorthandsize } =
      item;

    const icon = (light) => {
      if (itemtype === "gifIcon") {
        return light ? lightGifIcon : gifIcon ;
      }
      if (itemtype === "videoIcon") {
        return light ? lightVideoIcon : videoIcon;
      }
      if (itemtype === "imageIcon") {
        return light ? lightImageIcon : imageIcon;
      }
      if (itemtype === "documentIcon") {
        return light ? lightDocumentIcon : documentIcon;
      }
      if (itemtype === "unknownIcon") {
        return light ? lightUnknownIcon : unknownIcon;
      }
      if (itemtype === "folderIcon") {
        return light ? lightFolderIcon : folderIcon;
      }
    };

    if (name) {
      return (
        <div
          key={`Name: ${name}\nSize: ${size}\nType: ${fileextension}`}
          className="renderfile--block"
          // decide what to do when a user clicks on an item.
          onClick={() => {
            changeFolderOrViewFiles(
              itemtype,
              name,
              itemsInDirectory.indexOf(item)
            );
          }}
        >
          {/* which icon/thumbnail is gonna be rendered */}
          {(() => {
            if (thumbnail) {
              if (itemtype === "imageIcon" || itemtype === "gifIcon") {
                return (
                  <div
                    className="renderfile--block"
                    id="renderfile--image-block"
                    title={`Name: ${name}\nSize: ${shorthandsize}\nType: ${fileextension}`}
                  >
                    <img
                      src={thumbnail}
                      alt="imagethumb"
                      className="renderfile--thumbnail"
                      id="renderfile--image-thumbnail"
                    />
                    <img
                      src={icon()}
                      onMouseEnter={(e) => {e.currentTarget.src = icon(true)}}
                      onMouseLeave={(e) => {e.currentTarget.src = icon()}}
                      alt="imageicon"
                      id="renderfile--corner-icon"
                    />
                    <p className="renderfile--text">
                      Item name: {sliceName(name)}
                    </p>
                  </div>
                );
              } else if (itemtype === "videoIcon") {
                return (
                  <div
                    className="renderfile--block"
                    title={`Name: ${name}\nSize: ${shorthandsize}\nType: ${fileextension}`}
                  >
                    <img
                      src={thumbnail}
                      alt="gifthumb"
                      className="renderfile--thumbnail"
                      id="renderfile--video-thumbnail"
                    />
                    <img
                      src={playIcon}
                      onMouseEnter={(e) => {e.currentTarget.src = lightPlayIcon}}
                      onMouseLeave={(e) => {e.currentTarget.src = playIcon}}
                      alt="playvideo"
                      id="renderfile--play-icon"
                    />
                    <p className="renderfile--text">
                      Item name: {sliceName(name)}
                    </p>
                  </div>
                );
              }
            } else {
              return (
                <div
                  className="renderfile--block"
                  title={`Name: ${name}\nSize: ${shorthandsize}\nType: ${fileextension}`}
                >
                  <img
                    src={icon()}
                    onMouseEnter={(e) => {e.currentTarget.src = icon(true)}}
                    onMouseLeave={(e) => {e.currentTarget.src = icon()}}
                    alt="fileicon"
                    className="renderfile--full-icon"
                  />
                  <p className="renderfile--text">
                    Item name: {sliceName(name)}
                  </p>
                </div>
              );
            }
          })()}
        </div>
      );
    }
    return "";
  });
  return <div id="renderfile--page">{renderItems}</div>;
}

export default RenderFiles;

import React, { useEffect, useContext } from "react";
import { DirectoryContext } from "../App";
import folderIcon from "../images/folder.png";
import gifIcon from "../images/gif.png";
import videoIcon from "../images/film.png";
import documentIcon from "../images/document.png";
import imageIcon from "../images/image.png";
import unknownIcon from "../images/unknownfile.png";
import playIcon from "../images/play.png";

function RenderFiles(props) {
  const {
    itemsInDirectory,
    setCurrentIndex,
    setViewImage,
    setViewVideo,
    viewVideo,
    viewImage,
    viewDocument,
    clear,
    setViewDocument,
  } = props;

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
      if (viewVideo.path || viewImage.imageURL || viewDocument.document) {
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
          viewVideo.itemtype || viewImage.itemtype || viewDocument.itemtype,
          viewImage.name || viewVideo.name || viewDocument.name,
          viewImage.index || viewVideo.index || viewDocument.index,
          direction
        );
      }
    }
    document.addEventListener("keydown", navigateImagesAndVideos);
    return () => {
      document.removeEventListener("keydown", navigateImagesAndVideos);
    };
  });

  function changeFolderOrViewFiles(type, filename, index, direction) {
    if (direction) {
      if (direction === "forwards") {
        for (let i = index + 1; i < itemsInDirectory.length; i++) {
          if (
            itemsInDirectory[i].itemtype === "videoIcon" ||
            itemsInDirectory[i].itemtype === "imageIcon" ||
            itemsInDirectory[i].itemtype === "documentIcon"
          ) {
            type = itemsInDirectory[i].itemtype;
            filename = itemsInDirectory[i].name;
            index = i;
            break;
          }
        }
      } else if (direction === "backwards") {
        for (let i = index - 1; i > 0; i--) {
          if (
            itemsInDirectory[i].itemtype === "videoIcon" ||
            itemsInDirectory[i].itemtype === "imageIcon" ||
            itemsInDirectory[i].itemtype === "documentIcon"
          ) {
            type = itemsInDirectory[i].itemtype;
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
    } else if (type === "imageIcon" || type === "gifIcon") {
      fetch("/api/loadfiles/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: filename,
        }),
      })
        .then(async (res) => {
          const response = await res.blob();
          const imageURL = URL.createObjectURL(response);

          setViewImage({
            imageURL: imageURL,
            index: index,
            itemtype: type,
            name: filename,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (type === "videoIcon") {
      setViewVideo({
        path: `/api/loadfiles/playvideo/${filename}`,
        index: index,
        itemtype: type,
        name: filename,
      });
    } else if (type === "documentIcon") {
      fetch("/api/loadfiles/document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document: filename,
        }),
      })
        .then(async (res) => {
          const response = await res.blob();

          const reader = new FileReader();
          reader.onload = function () {
            setViewDocument({
              document: reader.result,
              index: index,
              itemtype: type,
              name: filename,
            });
          };
          reader.readAsText(response);
        })
        .catch((err) => {
          console.log(err);
        });
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

    const icon = () => {
      if (itemtype === "gifIcon") {
        return gifIcon;
      }
      if (itemtype === "videoIcon") {
        return videoIcon;
      }
      if (itemtype === "imageIcon") {
        return imageIcon;
      }
      if (itemtype === "documentIcon") {
        return documentIcon;
      }
      if (itemtype === "unknownIcon") {
        return unknownIcon;
      }
      if (itemtype === "folderIcon") {
        return folderIcon;
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

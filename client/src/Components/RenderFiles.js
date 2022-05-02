import React from "react";

import folderIcon from "../images/folder.png";
import gifIcon from "../images/gif.png";
import videoIcon from "../images/film.png";
import documentIcon from "../images/document.png";
import imageIcon from "../images/image.png";
import unknownIcon from "../images/unknownfile.png";

import regPlayIcon from "../images/play.png";

function RenderFiles(props) {
  const {
    itemsInDirectory,
    setCurrentDir,
    setCurrentItem,
    currentDir,
    setViewImage,
  } = props;

  // render the file data and thumbnails
  const renderItems = itemsInDirectory.map((item) => {
    const { itemtype, name, fileextension, size, thumbnail } = item;

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
          key={name}
          className="renderfile--block"
          onClick={() => {
            if (itemtype === "folderIcon") {
              setCurrentDir((prevDir) => `${prevDir}${name}/`);
              setCurrentItem(0);
            } else if (itemtype === "imageIcon" || itemtype === "gifIcon") {
              fetch("/api/loadfiles/image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: name,
                  currentdirectory: currentDir,
                }),
              })
                .then(async (res) => {
                  const response = await res.blob();
                  const imageURL = URL.createObjectURL(response);
                  setViewImage(imageURL);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          }}
          title={`Type: ${fileextension}\nSize: ${size}`}
        >
          {(() => {
            if (thumbnail) {
              if (itemtype === "imageIcon" || itemtype === "gifIcon") {
                return (
                  <div className="renderfile--block">
                    <img
                      src={thumbnail}
                      alt="imagethumb"
                      className="renderfile--thumbnail"
                    />
                    <img
                      src={icon()}
                      alt="imageicon"
                      className="renderfile--icon"
                    />
                  </div>
                );
              } else if (itemtype === "videoIcon") {
                return (
                  <div className="renderfile--block">
                    <img
                      src={thumbnail}
                      alt="gifthumb"
                      className="renderfile--thumbnail"
                    />
                    <img
                      src={regPlayIcon}
                      alt=""
                      className="renderfile--play-icon"
                    />
                  </div>
                );
              } 
            }
            else {
              return (
                <div className="renderfile--block">
                  <img
                    src={icon()}
                    alt="fileicon"
                    className="renderfile--full-icon"
                  />
                </div>
              );
            }
          })()}
          <p className="renderfile--text">File name: {name}</p>
        </div>
      );
    }
    return "";
  });
  return <div id="renderfile--page">{renderItems}</div>;
}

export default RenderFiles;

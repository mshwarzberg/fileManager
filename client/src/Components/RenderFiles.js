import React, { useEffect, useContext } from "react";

// context import
import { DirectoryContext } from "../App";
import { ItemContext } from "./Main";
// component import
import ImageGif from "./RenderItems/ImageGif";
import Video from "./RenderItems/Video";
import Icon from "./RenderItems/Icon";

function RenderFiles(props) {
  
  const { itemsInDirectory } = props;

  const { setCurrentDir } = useContext(DirectoryContext);
  const { viewItem, setViewItem } = useContext(ItemContext);

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
    } else if (
      type === "image" ||
      type === "gif" ||
      type === "document"
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
          if (
            type === "video" ||
            type === "image" ||
            type === "document"
          ) {
            filename = itemsInDirectory[i].name;
            index = i;
            break;
          }
        }
      } else if (direction === "backwards") {
        for (let i = index - 1; i > 0; i--) {
          type = itemsInDirectory[i].itemtype;
          if (
            type === "video" ||
            type === "image" ||
            type === "document"
          ) {
            filename = itemsInDirectory[i].name;
            index = i;
            break;
          }
        }
      }
    }

    if (type === "folder") {
      setCurrentDir((prevDir) => `${prevDir}/${filename}`);
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
    const { itemtype, name, fileextension, size, thumbnail, shorthandsize } =
      item;
    if (name) {
      return (
        <div
          key={`Name: ${name}\nSize: ${size}\nType: ${fileextension}`}
          // decide what to do when a user clicks on an item.
          onClick={() => {
            changeFolderOrViewFiles(
              itemtype,
              name,
              itemsInDirectory.indexOf(item)
            );
          }}
        >
          <ImageGif
            name={name}
            shorthandsize={shorthandsize}
            fileextension={fileextension}
            itemtype={itemtype}
            thumbnail={thumbnail}
          />
          <Video
            name={name}
            shorthandsize={shorthandsize}
            fileextension={fileextension}
            thumbnail={thumbnail}
            itemtype={itemtype}
          />
          <Icon
            name={name}
            shorthandsize={shorthandsize}
            fileextension={fileextension}
            itemtype={itemtype}
            thumbnail={thumbnail}
          />
        </div>
      );
    }
    return "";
  });
  return <div id="renderfile--page">{renderItems}</div>;
}

export default RenderFiles;

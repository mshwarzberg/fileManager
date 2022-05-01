import React, { useState, useEffect } from "react";
import folderIcon from "../images/folder.png";
import gifIcon from "../images/gif.png";
import videoIcon from "../images/film.png";
import documentIcon from "../images/document.png";
import imageIcon from "../images/image.png";
import unknownIcon from "../images/unknownfile.png";

function Explorer() {
  const [currentDir, setCurrentDir] = useState("/");
  const [itemsInDirectory, setITemsInDirectory] = useState([]);
  const [currentItem, setCurrentItem] = useState(0)
  // load file data
  useEffect(() => {
    fetch("/api/explorer/loaddata", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentDirectory: currentDir }),
    })
      .then(async (res) => {
        let response = await res.json();
        setITemsInDirectory(response.result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [currentDir]);

  // load thumbnails
  useEffect(() => {
     if (itemsInDirectory[currentItem]) {
      fetch("/api/explorer/getthumbs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prefix: itemsInDirectory[currentItem].prefix, currentDirectory: currentDir }),
      })
        .then(async (res) => {
          let response = await res.blob();
          setITemsInDirectory(prevItem => {
            const imageURL = URL.createObjectURL(response)
            return prevItem.map(item => {
              if (res.headers.get('prefix') === item.prefix) {
              }
              const newData = {
                ...item,
                thumbnail: res.headers.get('prefix') === item.prefix ? imageURL : item.thumbnail
              }
              return newData
            })
          })
          setCurrentItem(prevItem => prevItem + 1)
        })
        .catch((err) => {
          console.log(err);
        });
     }
  }, [setCurrentItem, itemsInDirectory, currentItem]);

  // render the file data and thumbnails
  const renderItems = itemsInDirectory.map((item) => {

    const icon = () => {
      if (item.itemtype === "gifIcon") {
        return gifIcon;
      }
      if (item.itemtype === "videoIcon") {
        return videoIcon;
      }
      if (item.itemtype === "imageIcon") {
        return imageIcon;
      }
      if (item.itemtype === "documentIcon") {
        return documentIcon;
      }
      if (item.itemtype === "unknownIcon") {
        return unknownIcon;
      }
      if (item.itemtype === "folderIcon") {
        return folderIcon;
      }
    };

    if (item.name) {
      return (
        <div
          key={item.name}
          className="viewport--file-data"
          onClick={() => {
            if (item.itemtype === "folderIcon") {
              setCurrentDir(`/${item.name}`);
              setCurrentItem(0)
            }
          }}
        >
          {item.thumbnail ? <img src={item.thumbnail} className="viewport--icon"/> : <img src={icon()} alt="icon" className="viewport--icon" />}
          <p>File name: {item.name}</p>
          <p>Type of item: {item.fileextension}</p>
        </div>
      );
    }
    return "";
  });

  return <div id="viewport--folders-and-files">{renderItems}</div>;
}

export default Explorer;

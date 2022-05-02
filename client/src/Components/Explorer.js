import React, { useState, useEffect } from "react";

import Navbar from "./Navbar";
import RenderFiles from "./RenderFiles";

function Explorer() {
  // usestate to hold the value of the current directory, the actual items within it that are gonna be rendered, and the current index to later use to apply thumbnails if applicable.
  const [currentDir, setCurrentDir] = useState("/");
  const [itemsInDirectory, setITemsInDirectory] = useState([]);
  const [currentItem, setCurrentItem] = useState(0);
  const [viewImage, setViewImage] = useState();

  // load file data
  useEffect(() => {
    fetch("/api/explorer/loaddata", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentDirectory: currentDir }),
    })
      .then(async (res) => {
        let response = await res.json();
        setCurrentDir(response[response.length - 1].currentdirectory);
        setITemsInDirectory(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [currentDir, setCurrentDir]);

  // load thumbnails
  useEffect(() => {
    if (itemsInDirectory[currentItem]) {
      fetch("/api/explorer/getthumbs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prefix: itemsInDirectory[currentItem].prefix,
          currentdirectory: currentDir,
          suffix: itemsInDirectory[currentItem].fileextension,
        }),
      })
        .then(async (res) => {
          let response = await res.blob();
          let imageURL = URL.createObjectURL(response);

          setITemsInDirectory((prevItem) => {
            return prevItem.map((item) => {
              const newData = {
                ...item,
                thumbnail:
                  res.headers.get("prefix") === item.prefix &&
                  res.headers.get("suffix") === item.fileextension
                    ? imageURL
                    : item.thumbnail,
              };
              return newData;
            });
          });
          setCurrentItem(currentItem + 1);
        })
        .catch((err) => {
          console.log(err);
        });
      return;
    }
  }, [itemsInDirectory, currentItem, currentDir]);

  return (
    <div id="explorer--page">
      {!viewImage && (
        <Navbar
          currentDir={currentDir}
          setCurrentDir={setCurrentDir}
          setCurrentItem={setCurrentItem}
        />
      )}
      {viewImage && (
        <div
          id="viewimage--view-block"
          onClick={() => {
            return setViewImage();
          }}
        >
          <img id="viewimage--view-image" src={viewImage} alt="focused" />
        </div>
      )}
      <RenderFiles
        itemsInDirectory={itemsInDirectory}
        setCurrentDir={setCurrentDir}
        setCurrentItem={setCurrentItem}
        currentDir={currentDir}
        setViewImage={setViewImage}
      />
    </div>
  );
}

export default Explorer;

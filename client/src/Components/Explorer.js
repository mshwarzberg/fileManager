import React, { useState, useEffect, useContext } from "react";

import Navbar from "./Navbar";
import RenderFiles from "./RenderFiles";
import ItemDisplayFocused from "./ItemDisplayFocused";

import { DirectoryContext } from "../App";

function Explorer() {

  const { currentDir, setCurrentDir } = useContext(DirectoryContext);

  // usestate to hold the value of the current directory, the actual items within it that are gonna be rendered, and the current index to later use to apply thumbnails if applicable.
  const [itemsInDirectory, setItemsInDirectory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [viewItem, setViewItem] = useState({
    type: null,
    property: null,
    index: null,
    name: null,
  });

  // turn the byte integers from the filesize to more readable format
  function shortHandFileSize(originalSize) {

    let newSize;
    let letter

    if (originalSize < 1000) {
      newSize = originalSize
      letter = ''
    }
    else if (originalSize > 1000 && originalSize < 950000) {
      newSize = originalSize / 1000;
      letter = 'K'
    } else if (originalSize >= 950000 && originalSize < 950000000) {
      newSize = originalSize / 1000000;
      letter = 'M'
    } else if (originalSize >= 950000000) {
      newSize = originalSize / 1000000000;
      letter = 'G'
    } else {
      return originalSize
    }

    newSize = newSize.toString().slice(0, 5);
    newSize += `${letter}B`;

    return newSize;
  }
  // wasn't able to pass in the directory into the video in RenderFiles component so I'm setting it here so that the video may load from any folder.
  useEffect(() => {
    fetch("/api/loadfiles/setdirectorytocurrent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentdirectory: currentDir }),
    });
  }, [currentDir, setCurrentDir]);

  // load file data
  useEffect(() => {
    fetch("/api/explorer/loaddata", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentdirectory: currentDir }),
    })
      .then(async (res) => {
        let response = await res.json();
        setCurrentDir(response[response.length - 1].currentdirectory);
        setItemsInDirectory(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [currentDir, setCurrentDir]);

  // load thumbnails
  useEffect(() => {
    if (itemsInDirectory[currentIndex]) {
      fetch("/api/explorer/getthumbs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prefix: itemsInDirectory[currentIndex].prefix,
          currentdirectory: `/${currentDir}`,
          suffix: itemsInDirectory[currentIndex].fileextension,
        }),
      })
        .then(async (res) => {
          let response = await res.blob();
          let imageURL = URL.createObjectURL(response);

          setItemsInDirectory((prevItem) => {
            return prevItem.map((item) => {
              const newData = {
                ...item,
                shorthandsize: shortHandFileSize(item.size),
                thumbnail:
                  res.headers.get("prefix") === item.prefix &&
                  res.headers.get("suffix") === item.fileextension
                    ? imageURL
                    : item.thumbnail,
              };
              return newData;
            });
          });
          setCurrentIndex(currentIndex + 1);
        })
        .catch((err) => {
          console.log(err);
        });
      return;
    }
  }, [itemsInDirectory, currentIndex, currentDir]);

  function clear() {
    URL.revokeObjectURL(viewItem.property);
    setViewItem({
      type: null,
      property: null,
      index: null,
      name: null,
    });
  }

  return (
    <div id="explorer--page">
      <ItemDisplayFocused
        viewItem={viewItem}
        clear={clear}
        setViewItem={setViewItem}
      />
      <Navbar setCurrentIndex={setCurrentIndex} />
      <RenderFiles
        itemsInDirectory={itemsInDirectory}
        setCurrentIndex={setCurrentIndex}
        viewItem={viewItem}
        setViewItem={setViewItem}
        clear={clear}
      />
    </div>
  );
}

export default Explorer;

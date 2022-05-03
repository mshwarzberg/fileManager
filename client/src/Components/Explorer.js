import React, { useState, useEffect, useContext } from "react";

import Navbar from "./Navbar";
import RenderFiles from "./RenderFiles";
import ItemDisplay from "./ItemDisplay";

import  {DirectoryContext} from '../App'

function Explorer() {

  const {currentDir, setCurrentDir} = useContext(DirectoryContext)

  // usestate to hold the value of the current directory, the actual items within it that are gonna be rendered, and the current index to later use to apply thumbnails if applicable.
  const [itemsInDirectory, setITemsInDirectory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  // view images, videos and documents.
  const [viewImage, setViewImage] = useState({
    imageURL: "",
    index: null,
  });
  const [viewVideo, setViewVideo] = useState({
    path: "",
    index: null,
  });
  const [viewDocument, setViewDocument] = useState({
    document: "",
    index: null,
  });

  function shortHandFileSize(originalSize) {
    let newSize;

    if (originalSize > 1000 && originalSize < 950000) {
      newSize = originalSize / 1000;
      newSize = newSize.toString().slice(0, 5);
      newSize += "KB";
    }
    else if (originalSize >= 950000 && originalSize < 950000000) {
      newSize = originalSize / 1000000;
      newSize = newSize.toString().slice(0, 5);
      newSize += "MB";
    }
    else if (originalSize >= 950000000) {
      newSize = originalSize / 1000000000;
      newSize = newSize.toString().slice(0, 5);
      newSize += "GB";
    }
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
        setITemsInDirectory(response);
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

          setITemsInDirectory((prevItem) => {
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
    URL.revokeObjectURL(viewImage.imageURL);
    setViewVideo({
      path: "",
      index: null,
    });
    setViewImage({
      imageURL: null,
      index: null,
    });
    setViewDocument({
      document: null,
      index: null,
    });
  }

  return (
    <div id="explorer--page">
      <Navbar
        setCurrentIndex={setCurrentIndex}
      />
      <ItemDisplay
        viewDocument={viewDocument}
        viewVideo={viewVideo}
        viewImage={viewImage}
        clear={clear}
      />
      <RenderFiles
        viewImage={viewImage}
        viewVideo={viewVideo}
        viewDocument={viewDocument}
        itemsInDirectory={itemsInDirectory}
        setCurrentIndex={setCurrentIndex}
        setViewImage={setViewImage}
        setViewVideo={setViewVideo}
        setViewDocument={setViewDocument}
        clear={clear}
      />
    </div>
  );
}

export default Explorer;

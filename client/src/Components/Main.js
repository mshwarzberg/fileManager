import React, { useState, useEffect, useContext } from "react";
import { DirectoryContext } from "../App";
import SortBy from "./Navbar/SortBy";
import RenderFiles from "./RenderFiles";

import shortHandFileSize from "../Helpers/FileSize";

import Navbar from "./Navbar/Navbar";

function Main() {
  const { currentDir, setCurrentDir } = useContext(DirectoryContext);

  // usestate to hold the value of the current directory, the actual items within it that are gonna be rendered, and the current index to later use to apply thumbnails if applicable.
  // change to usereducer
  const [itemsInDirectory, setItemsInDirectory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState();

  // wasn't able to pass in the directory into the video in RenderFiles component so I'm setting it here so that the video may load from any folder.
  useEffect(() => {
    fetch("/api/loadfiles/setdirectorytocurrent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentdirectory: currentDir }),
    });
    setCurrentIndex(0);
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
        if (response.err) {
          return setError(response.err);
        }
        setItemsInDirectory([
          ...response.map((item) => ({
            ...item,
            prefix: decodeURIComponent(item.prefix),
          })),
        ]);
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
  }, [itemsInDirectory, setItemsInDirectory, currentIndex, currentDir]);

  return (
    <div id="explorer--page">
      <nav id="navbar--container">
        <Navbar />
        <SortBy setItemsInDirectory={setItemsInDirectory} />
      </nav>
      {!error && <RenderFiles itemsInDirectory={itemsInDirectory} />}
      {error && <h1>{error}</h1>}
    </div>
  );
}

export default Main;

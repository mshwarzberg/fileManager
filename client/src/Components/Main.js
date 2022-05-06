import React, { useState, useEffect, useContext } from "react";
import { DirectoryContext } from "../App";

import InputDirectoryChange from "./Navbar/DirectoryManagement/InputDirectoryChange";
import RenderFiles from "./Rendering/RenderFiles";
import Navbar from "./Navbar/Navbar";

import shortHandFileSize from "../Helpers/FileSize";

function Main() {
  const { currentDir, setCurrentDir } = useContext(DirectoryContext);

  const [itemsInDirectory, setItemsInDirectory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [notFoundError, setNotFoundError] = useState(false);

  const [navigatedDirs, setNavigatedDirs] = useState({
    array: ["./rootDir"],
    index: 0,
  });

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

  useEffect(() => {
    fetch("/api/explorer/loaddata", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentdirectory: currentDir }),
    })
      .then(async (res) => {
        let response = await res.json();
        if (response.err) {
          setNotFoundError(true);
          setTimeout(() => {
            return setNotFoundError(false);
          }, 5000);
        } else {
          setItemsInDirectory([...response]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [currentDir, setCurrentDir]);

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
    <div id="main--page">
      <Navbar
      itemsInDirectory={itemsInDirectory}
        setItemsInDirectory={setItemsInDirectory}
        navigatedDirs={navigatedDirs}
        setNavigatedDirs={setNavigatedDirs}
      />
      <InputDirectoryChange
        itemsInDirectory={itemsInDirectory}
        notFoundError={notFoundError}
        setNavigatedDirs={setNavigatedDirs}
      />
      {!notFoundError && <RenderFiles itemsInDirectory={itemsInDirectory} setNavigatedDirs={setNavigatedDirs}/>}
      {notFoundError && <h1 id="inputdirectory--not-found-error">Folder Not Found</h1>}
    </div>
  );
}

export default Main;

import React, { useState, useEffect, useContext } from "react";
import { DirectoryContext } from "../App";
import InputDirectoryChange from "./Navbar/DirectoryManagement/SearchDirectory";
import RenderFiles from "./Rendering/RenderFiles";
import Navbar from "./Navbar/Navbar";
import shortHandFileSize from "../Helpers/FileSize";

function Main() {
  const { state, setDirTree, setAction } = useContext(DirectoryContext);

  const [itemsInDirectory, setItemsInDirectory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    fetch("/api/loadfiles/setdirectorytocurrent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentdirectory: state.currentDirectory }),
    });
    setCurrentIndex(0);
  }, [state.currentDirectory]);

  useEffect(() => {
    function compare(arrayA, arrayB) {
      if (arrayA === arrayB) return true;
      if (arrayA == null || arrayB == null) return false;
      if (arrayA.length !== arrayB.length) {
        return false;
      }

      for (let i = 0; i < arrayA.length; i++) {
        if (arrayA[i] !== arrayB[i]) return false;
      }
      return true;
    }
    let folders = [];
    for (let i = 0; i < itemsInDirectory.length; i++) {
      if (itemsInDirectory[i].itemtype === "folder") {
        folders.push(itemsInDirectory[i].name);
      }
    }
    
    if (
      !compare(
        folders,
        state.directoryTree[state.directoryTree.length - 1][state.treeIndex]
      ) && folders.length > 0
    ) {
      // setAction("addTreeIndex");
      // setDirTree(folders);
    }
  }, [itemsInDirectory]);

  useEffect(() => {
    fetch("/api/explorer/loaddata", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentdirectory: state.currentDirectory }),
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
  }, [state.currentDirectory]);

  useEffect(() => {
    if (itemsInDirectory[currentIndex]) {
      fetch("/api/explorer/getthumbs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prefix: itemsInDirectory[currentIndex].prefix,
          currentdirectory: `/${state.currentDirectory}`,
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
  }, [
    itemsInDirectory,
    setItemsInDirectory,
    currentIndex,
    state.currentDirectory,
  ]);

  return (
    <div id="main--page">
      <Navbar
        itemsInDirectory={itemsInDirectory}
        setItemsInDirectory={setItemsInDirectory}
      />
      <InputDirectoryChange
        itemsInDirectory={itemsInDirectory}
        notFoundError={notFoundError}
      />
      {!notFoundError && <RenderFiles itemsInDirectory={itemsInDirectory} />}
      {notFoundError && (
        <h1 id="inputdirectory--not-found-error">Folder Not Found</h1>
      )}
    </div>
  );
}

export default Main;

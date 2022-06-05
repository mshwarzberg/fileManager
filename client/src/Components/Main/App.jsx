import React, { createContext, useEffect, useState } from "react";
import DirectoryContextManager from "./Context/DirectoryContext";

import useFetch from "../../Hooks/useFetch";
import shortHandFileSize from "../../Helpers/FileSize";
import useUpdateDirectoryTree from "../../Hooks/useUpdateDirectoryTree";
import CompareArray from "../../Helpers/CompareArray";

import RenderItems from "../RenderDirectoryItems/RenderItems";
import Navbar from "./Navbar/Navbar";
import DirectoryTree from "../RenderDirectoryItems/DirectoryTree/DirectoryTree";
import useStoreImages from "../../Hooks/useStoreImages";

export const DirectoryContext = createContext();

let timeout;
export default function App() {
  const changeItem = useUpdateDirectoryTree();

  const { state, dispatch } = DirectoryContextManager();

  const [directoryItems, setDirectoryItems] = useState();

  function fetchStuff(index, requestsMadeForThisItem) {
    if (requestsMadeForThisItem >= 15) {
      return;
    }
    fetch("/api/data/thumbs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prefix: itemData[index].prefix,
        suffix: itemData[index].fileextension,
        currentdirectory: state.currentDirectory,
      }),
    })
      .then(async (res) => {
        let response = await res.blob();
        if (response.size === 0) {
          if (
            itemData[index].itemtype === "image" ||
            itemData[index].itemtype === "video" || 
            itemData[index].itemtype === 'gif'
          ) {
            return fetchStuff(index, requestsMadeForThisItem + 1);
          }
        }
        let imageURL = URL.createObjectURL(response);
        setDirectoryItems((prevItem) => {
          return prevItem.map((item) => {
            const doesMatch =
              res.headers.get("prefix") === item.prefix &&
              res.headers.get("suffix") === item.fileextension;

            const newData = {
              ...item,
              shorthandsize: shortHandFileSize(item.size),
              ...(doesMatch && {
                thumbnail: imageURL,
                width: res.headers.get("width"),
                height: res.headers.get("height"),
                duration: res.headers.get("duration"),
              }),
            };
            return newData;
          });
        });
      })
      .catch((err) => {
        console.log("App.jsx, Thumbnail", err);
      });
  }

  const { data: itemData } = useFetch(
    "/api/data/data",
    JSON.stringify({ currentdirectory: state.currentDirectory }),
    state.currentDirectory
  );

  const { data: directories } = useFetch(
    "/api/senddirectories",
    JSON.stringify({ path: state.currentDirectory }),
    state.currentDirectory
  );

  useEffect(() => {
    if (!state.currentDirectory) {
      fetch("/api/data/choosedrive", {
        method: "GET",
      })
        .then(async (res) => {
          const response = await res.json();
          setDirectoryItems(response);
        })
        .catch((err) => {
          console.log("App.jsx choose drive", err);
        });
    }
    clearTimeout(timeout);
    if (itemData && !itemData.err) {
      if (!CompareArray(itemData, directoryItems)) {
        setDirectoryItems(itemData);
        for (let i = 0; i < itemData.length; i++) {
          fetchStuff(i, 0);
        }
      }
    }
    if (itemData?.length === 0) {
      setDirectoryItems([{ msg: "Folder is empty" }]);
    } else if (itemData?.err) {
      setDirectoryItems([{ msg: "Error Occurred" }]);
      timeout = setTimeout(() => {
        dispatch({ type: "directoryNotFoundError" });
      }, 2000);
    }
    // eslint-disable-next-line
  }, [itemData, state.currentDirectory]);

  useEffect(() => {
    if (directories && !state.directoryTree[0] && directories.array) {
      let parentDirs = state.currentDirectory
        .split("/")
        .slice(1, state.currentDirectory.length);
      parentDirs = [...parentDirs, ...directories.array];

      dispatch({
        type: "updateDirectoryTree",
        value: changeItem(
          state.directoryTree,
          parentDirs,
          0,
          directories.array
        ),
      });
    }
    // eslint-disable-next-line
  }, [directories]);

  // useEffect(() => {
  //   if (itemData && !itemData.err) {
  //     if (!CompareArray(itemData, directoryItems)) {
  //       for (let i in itemData) {
  //         fetch("/api/directorydata", {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             path: itemData[i].path,
  //           }),
  //         })
  //           .then((res) => {
  //             return res.json();
  //           })
  //           .then((res) => {
  //             setDirectoryItems((prevItem) => {
  //               return prevItem.map((item) => {
  //                 const newData = {
  //                   ...item,
  //                   ...(item.name === itemData[i].name && {
  //                     shorthandsize: shortHandFileSize(res.bytes),
  //                     filecount: res.filecount,
  //                     foldercount: res.foldercount,
  //                     size: res.bytes
  //                   }),
  //                 }
  //                 return newData
  //               });
  //             });
  //           })
  //           .catch(() => {
  //             return;
  //           });
  //       }
  //     }
  //   }
  // });

  useStoreImages();

  return (
    <DirectoryContext.Provider
      value={{ state, dispatch, directoryItems, setDirectoryItems }}
    >
      <Navbar />
      <RenderItems />
      <DirectoryTree />
    </DirectoryContext.Provider>
  );
}

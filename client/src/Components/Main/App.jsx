import React, { createContext, useEffect, useState } from "react";
import DirectoryContextManager from "./Context/DirectoryContext";

import useFetch from "../../Hooks/useFetch";
import shortHandFileSize from "../../Helpers/FileSize";
import useUpdateDirectoryTree from "../../Hooks/useUpdateDirectoryTree";
import CompareArray from "../../Helpers/CompareArray";

import RenderItems from "../RenderDirectoryItems/RenderItems";
import Navbar from './Navbar/Navbar'
import DirectoryTree from "../RenderDirectoryItems/DirectoryTree/DirectoryTree";

export const DirectoryContext = createContext();

export default function App() {
  
  const changeItem = useUpdateDirectoryTree();

  const { state, dispatch } = DirectoryContextManager()

  const [directoryItems, setDirectoryItems] = useState();

  useEffect(() => {
    fetch("/api/loadfiles/setdirectorytocurrent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentdirectory: state.currentDirectory || '/' }),
    });
  }, [state.currentDirectory]);

  // get all items in the current directory
  const { data: itemData } = useFetch(
    "/api/data/data",
    JSON.stringify({ currentdirectory: state.currentDirectory || '/' })
  );
  // get all subdirectories for the directory tree. This has no dependencies since reloading shouldn't affect the tree.
  const { data: directories } = useFetch(
    "/api/senddirectories",
    JSON.stringify({ path: state.currentDirectory || '/'})
  );

  useEffect(() => {
    if (itemData) {
      if (!CompareArray(itemData, directoryItems)) {
        setDirectoryItems(itemData);
        for (let i = 0; i < itemData.length; i++) {
          fetchStuff(i, 0);
        }
      }
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
        currentdirectory: state.currentDirectory || '/',
      }),
    })
      .then(async (res) => {
        let response = await res.blob();
        if (response.size === 0 && response.type === "") {
          if (
            itemData[index].itemtype === "image" ||
            itemData[index].itemtype === "video"
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
              ...(doesMatch && { thumbnail: imageURL }),
              ...(doesMatch && { width: res.headers.get("width") }),
              ...(doesMatch && { height: res.headers.get("height") }),
              ...(doesMatch && { duration: res.headers.get("duration") }),
            };
            return newData;
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }


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

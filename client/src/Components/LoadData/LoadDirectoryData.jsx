import React, { useState, useEffect, useContext } from "react";
import { DirectoryStateContext } from "../../App";
import useFetch from "../../Hooks/useFetch";
import shortHandFileSize from "../../Helpers/FileSize";
import Navbar from "../Navbar/Navbar";
import RenderFiles from "../Rendering/RenderFiles";
import useUpdateDirectoryTree from "../../Hooks/useUpdateDirectoryTree";
import CompareArray from "../../Helpers/CompareArray";

function LoadDirectoryData() {
  const changeItem = useUpdateDirectoryTree();

  const { state, dispatch } = useContext(DirectoryStateContext);

  const [directoryItems, setDirectoryItems] = useState();
  const [notFoundError, setNotFoundError] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    if (notFoundError === true) {
      setTimeout(() => {
        dispatch({ type: "directoryNotFoundError" });
        setNotFoundError(false);
      }, 3000);
    }
  }, [notFoundError, dispatch]);

  useEffect(() => {
    fetch("/api/loadfiles/setdirectorytocurrent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentdirectory: state.currentDirectory }),
    });
  }, [state.currentDirectory]);

  // get all items in the current directory and add 'reload' as a dependency.
  const { data: itemData } = useFetch(
    "/api/data/data",
    JSON.stringify({ currentdirectory: state.currentDirectory }),
    reload
  );

  // get all subdirectories for the directory tree. This has no dependencies since reloading shouldn't affect the tree.
  const { data: directories } = useFetch(
    "/api/getdirectories",
    JSON.stringify({ path: state.currentDirectory })
  );

  function fetchStuff(index) {
    fetch("/api/data/thumbs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prefix: itemData[index].prefix,
        suffix: itemData[index].fileextension,
        currentdirectory: `${state.currentDirectory}`,
      }),
    })
      .then(async (res) => {
        let response = await res.blob();
        if (response.size === 0 && response.type === "") {
          if (
            itemData[index].itemtype === "image" ||
            itemData[index].itemtype === "video"
          ) {
            return fetchStuff(index);
          }
        }
        let imageURL = URL.createObjectURL(response);
        setDirectoryItems((prevItem) => {
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
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    if (itemData) {
      if (!CompareArray(itemData, directoryItems)) {
        setDirectoryItems(itemData);
        for (let i = 0; i < itemData.length; i++) {
          fetchStuff(i);
        }
      }
    }
  }, [itemData, state.currentDirectory]);

  useEffect(() => {
    // the first time everydrag loads update the directory tree to load all the directories within the root directory
    if (directories && !state.directoryTree[0]) {
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

  return (
    <div>
      <Navbar
        directoryItems={directoryItems}
        setDirectoryItems={setDirectoryItems}
        setReload={setReload}
        reload={reload}
      />
      <span id="navbar--current-directory-header">
        {state.currentDirectory}
      </span>

      <RenderFiles directoryItems={directoryItems} />
    </div>
  );
}

export default LoadDirectoryData;

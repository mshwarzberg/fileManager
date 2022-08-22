import React, { createContext, useEffect, useState } from "react";
import DirectoryState from "./DirectoryState";

import DisplayPage from "../RenderDirectoryItems/DisplayPage";
import Navbar from "./Navbar/Navbar";
import DirectoryTree from "../RenderDirectoryItems/DirectoryTree/DirectoryTree";
import GeneralUI from "../Tools/GeneralUI";

export const GeneralContext = createContext();

export default function App() {
  const { state, dispatch } = DirectoryState();

  const [controllers, setControllers] = useState([]);
  const [thumbController, setThumbController] = useState();
  const [directoryItems, setDirectoryItems] = useState([]);
  const [showTree, setShowTree] = useState(true);
  const [itemsSelected, setItemsSelected] = useState([]);
  const [backgroundFade, setBackgroundFade] = useState(`linear-gradient(
    90deg,
    #050505 0%,
    #050505 ${
      (localStorage.getItem("directoryTreeWidth") / window.innerWidth) * 100 ||
      20
    }%,
    #333 ${
      (localStorage.getItem("directoryTreeWidth") / window.innerWidth) * 100 +
        5 || 25
    }%,
    #333 100%
  )`);
  useEffect(() => {
    for (let i of controllers) {
      i.abort();
    }
    thumbController?.abort();
    setControllers([]);
    if (state.drive && state.currentDirectory) {
      document.title = state.currentDirectory;
      fetch("/api/metadata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentdirectory: state.currentDirectory,
          drive: state.drive,
        }),
      })
        .then(async (res) => {
          const response = await res.json();
          setDirectoryItems(response);
        })
        .catch(() => {});
    } else {
      fetch("/api/directorytree/initialtree")
        .then(async (res) => {
          const response = await res.json();
          dispatch({
            type: "updateDirectoryTree",
            value: [
              { collapsed: false, permission: true, isRoot: true },
              ...response,
            ],
          });
        })
        .catch((e) => {});
      fetch("/api/getdrives").then(async (res) => {
        const response = await res.json();
        setDirectoryItems(response);
      });
    }
    // eslint-disable-next-line
  }, [state.currentDirectory]);

  return (
    <GeneralContext.Provider
      value={{
        state,
        dispatch,
        directoryItems,
        setDirectoryItems,
        thumbController,
        setThumbController,
        itemsSelected,
        setItemsSelected,
      }}
    >
      <Navbar setShowTree={setShowTree} showTree={showTree} />
      <div
        id="directory-and-item-container"
        style={{
          background: backgroundFade,
        }}
      >
        <DirectoryTree showTree={showTree} />
        <DisplayPage
          controllers={controllers}
          setControllers={setControllers}
        />
      </div>
      {itemsSelected.length && (
        <div id="items-selected-count">
          {itemsSelected.length} items selected
        </div>
      )}
      <GeneralUI showTree={showTree} setBackgroundFade={setBackgroundFade} />
    </GeneralContext.Provider>
  );
}

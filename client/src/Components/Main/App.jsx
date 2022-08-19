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
        .catch(() => {
          dispatch({ type: "resetToDefault" });
        });
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
      <div id="directory-and-item-container">
        <DirectoryTree showTree={showTree} />
        <DisplayPage
          controllers={controllers}
          setControllers={setControllers}
        />
      </div>
      <GeneralUI />
    </GeneralContext.Provider>
  );
}

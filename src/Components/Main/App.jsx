import React, { createContext, useEffect, useState } from "react";
import DirectoryState from "./DirectoryState";
import DisplayPage from "../RenderDirectoryItems/DisplayPage";
import Navbar from "./Navbar/Navbar";
import DirectoryTree from "../RenderDirectoryItems/DirectoryTree/DirectoryTree";
import GeneralUI from "../Tools/GeneralUI";

import getMetadata from "./FS and OS/Metadata";
import initialDirectoryTree from "./FS and OS/InitialDirectoryTree";
import getDrives from "./FS and OS/GetDrives";
import generateThumbnails from "./FS and OS/GenerateThumbnails";
export const GeneralContext = createContext();

export default function App() {
  const { state, dispatch } = DirectoryState();

  const [controllers, setControllers] = useState([]);
  const [directoryItems, setDirectoryItems] = useState([]);
  const [showTree, setShowTree] = useState(
    JSON.parse(localStorage.getItem("isTreeVisible"))?.value || false
  );
  const [itemsSelected, setItemsSelected] = useState([]);

  useEffect(() => {
    for (let i of controllers) {
      i.abort();
    }
    setControllers([]);
    if (state.drive && state.currentDirectory) {
      document.title = state.currentDirectory;
      setDirectoryItems(
        getMetadata(
          state.currentDirectory,
          state.drive,
          state.networkDrives.includes(state.drive)
        )
      );
      generateThumbnails(state.currentDirectory, state.drive);
    } else {
      if (!state.directoryTree[0]) {
        initialDirectoryTree().then((result) => {
          dispatch({
            type: "updateDirectoryTree",
            value: [
              { collapsed: false, permission: true, isRoot: true },
              ...result,
            ],
          });
        });
      }
      getDrives().then((result) => {
        for (const item of result) {
          if (item.isNetworkDrive) {
            dispatch({
              type: "addNetworkDrive",
              value: item.path,
            });
            setDirectoryItems(result);
          }
        }
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
      <GeneralUI showTree={showTree} />
    </GeneralContext.Provider>
  );
}

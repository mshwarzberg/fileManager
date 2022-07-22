import React, { createContext, useEffect, useState } from "react";
import DirectoryState from "./Context/DirectoryState";

import RenderItems from "../RenderDirectoryItems/RenderItems";
import Navbar from "./Navbar/Navbar";
import DirectoryTree from "../RenderDirectoryItems/DirectoryTree/DirectoryTree";
import useStoreImages from "../../Hooks/useStoreImages";
import GeneralUI from "../Tools/GeneralUI";
import useDrag from "../../Hooks/useDrag";

export const DirectoryContext = createContext();

export default function App() {
  const { state, dispatch, controllers, setControllers } = DirectoryState();

  const [directoryItems, setDirectoryItems] = useState();

  useEffect(() => {
    if (state.drive && state.currentDirectory) {
      document.title = state.currentDirectory;
      for (let i of controllers) {
        i.abort();
      }
      setControllers([]);
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
        .catch((err) => {
          setDirectoryItems([
            {
              err: err.toString(),
            },
          ]);
        });
    } else {
      fetch("/api/getdrives", {
        method: "GET",
      }).then(async (res) => {
        const response = await res.json();
        setDirectoryItems(response);
      });
    }
    // eslint-disable-next-line
  }, [state.currentDirectory]);

  useStoreImages();
  useDrag(state);

  return (
    <DirectoryContext.Provider
      value={{
        state,
        dispatch,
        directoryItems,
        setDirectoryItems,
        controllers,
        setControllers,
      }}
    >
      <Navbar />
      <RenderItems />
      <DirectoryTree />
      <GeneralUI />
    </DirectoryContext.Provider>
  );
}

import React, { createContext, useEffect, useState } from "react";
import DirectoryContextManager from "./Context/DirectoryContext";

import useFetch from "../../Hooks/useFetch";
import CompareArray from "../../Helpers/CompareArray";

import RenderItems from "../RenderDirectoryItems/RenderItems";
import Navbar from "./Navbar/Navbar";
import DirectoryTree from "../RenderDirectoryItems/DirectoryTree/DirectoryTree";
import useStoreImages from "../../Hooks/useStoreImages";
import ContextMenu from "../Tools/ContextMenu/ContextMenu";

export const DirectoryContext = createContext();

export default function App() {
  const { state, dispatch, controllers, setControllers } =
    DirectoryContextManager();

  const [directoryItems, setDirectoryItems] = useState();

  const { data: itemData } = useFetch(
    "/api/data/data",
    JSON.stringify({
      currentdirectory: state.currentDirectory,
      drive: state.drive,
    }),
    state.currentDirectory
  );

  useEffect(() => {
    if (state.drive) {
      if (
        !CompareArray(itemData, directoryItems) &&
        state.currentDirectory !== ""
      ) {
        setControllers([]);
        setDirectoryItems(itemData);
      }
    } else {
      fetch("/api/data/choosedrive", {
        method: "GET",
      })
        .then(async (res) => {
          const response = await res.json();
          setDirectoryItems(response);
        })
        .catch((err) => {
          setDirectoryItems([{ name: err.toString() }]);
        });
    }
    // eslint-disable-next-line
  }, [state.currentDirectory, itemData]);

  useStoreImages();

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
      <ContextMenu />
      <Navbar />
      <RenderItems />
      <DirectoryTree />
    </DirectoryContext.Provider>
  );
}

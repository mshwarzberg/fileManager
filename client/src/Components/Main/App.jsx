import React, { createContext, useEffect, useState } from "react";
import DirectoryContextManager from "./Context/DirectoryState";

import useFetch from "../../Hooks/useFetch";
import CompareArray from "../../Helpers/CompareArray";

import RenderItems from "../RenderDirectoryItems/RenderItems";
import Navbar from "./Navbar/Navbar";
import DirectoryTree from "../RenderDirectoryItems/DirectoryTree/DirectoryTree";
import useStoreImages from "../../Hooks/useStoreImages";
import GeneralUI from "../Tools/GeneralUI";
import useDrag from "../../Hooks/useDrag";

export const DirectoryContext = createContext();

export default function App() {
  const { state, dispatch, controllers, setControllers } =
    DirectoryContextManager();

  const [directoryItems, setDirectoryItems] = useState();

  const { data: itemData } = useFetch(
    "/api/metadata",
    JSON.stringify({
      currentdirectory: state.currentDirectory,
      drive: state.drive,
    }),
    state.currentDirectory
  );

  useEffect(() => {
    if (state.drive && state.currentDirectory) {
      document.title = state.currentDirectory;
      if (
        !CompareArray(itemData, directoryItems) &&
        state.currentDirectory !== ""
      ) {
        for (let i of controllers) {
          i.abort();
        }
        setControllers([]);
        setDirectoryItems(itemData);
      } else if (itemData?.length === 0 || !itemData) {
        setDirectoryItems([]);
      }
    } else {
      fetch("/api/getdrives", {
        method: "GET",
      }).then(async (res) => {
        const response = await res.json();
        setDirectoryItems(response);
      });
    }
    try {
      if (itemData && itemData[0].err) {
        setTimeout(() => {
          dispatch({ type: "openDirectory", value: "" });
        }, 3000);
      }
    } catch {
      return;
    }
    // eslint-disable-next-line
  }, [itemData, state.currentDirectory]);

  useStoreImages();
  useDrag();
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

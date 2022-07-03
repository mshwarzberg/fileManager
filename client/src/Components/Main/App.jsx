import React, { createContext, useEffect, useState } from "react";
import DirectoryContextManager from "./Context/DirectoryContext";

import useFetch from "../../Hooks/useFetch";
import CompareArray from "../../Helpers/CompareArray";

import RenderItems from "../RenderDirectoryItems/RenderItems";
import Navbar from "./Navbar/Navbar";
import DirectoryTree from "../RenderDirectoryItems/DirectoryTree/DirectoryTree";
import useStoreImages from "../../Hooks/useStoreImages";
import GeneralUI from "../Tools/GeneralUI";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

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
    if (state.drive && state.currentDirectory) {
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
      fetch("/api/data/choosedrive", {
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
  }, [itemData]);

  useStoreImages();

  return (
    <Router>
      <Routes>
        <Route
          path={encodeURI(state.currentDirectory)}
          element={
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
          }
        />
        <Route
          path="*"
          element={<Navigate to={encodeURI(state.currentDirectory)} />}
        />
      </Routes>
    </Router>
  );
}

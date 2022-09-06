import React, { createContext, useEffect, useState } from "react";

import DirectoryState from "./DirectoryState";
import UIandUXState from "../UI and UX/UIandUXState";

import Page from "../DirectoryPage/Page";
import Navbar from "../Navbar/Navbar";
import DirectoryTree from "../DirectoryTree/DirectoryTree";

import formatMetadata from "../../Helpers/FS and OS/GetMetadata";
import formatDriveOutput from "../../Helpers/FS and OS/FormatDriveOutput";
import UIandUX from "../UI and UX/UIandUX";

export const DirectoryContext = createContext();

const fs = window.require("fs");

export default function App() {
  const { state, dispatch } = DirectoryState();
  const { settings, setSettings } = UIandUXState();

  const [directoryItems, setDirectoryItems] = useState([]);
  const [itemsSelected, setItemsSelected] = useState([]);
  const [lastSelected, setLastSelected] = useState();
  const [visibleItems, setVisibleItems] = useState([]);
  const [rename, setRename] = useState({});

  useEffect(() => {
    console.clear();
  }, []);

  useEffect(() => {
    async function updatePage() {
      setVisibleItems([]);
      if (state.drive && state.currentDirectory) {
        document.title = state.currentDirectory;
        let result = [];
        try {
          result = fs
            .readdirSync(state.currentDirectory, { withFileTypes: true })
            .map((file) => {
              return formatMetadata(
                file,
                state.currentDirectory,
                state.drive,
                state.networkDrives.includes(state.drive)
              );
            })
            .filter((item) => {
              return item.name && item;
            });

          setDirectoryItems(
            result.sort((a, b) => {
              if (a.isDirectory) {
                return 1;
              }
              if (b.isDirectory) {
                return -1;
              }
              return a.name.localeCompare(b.name);
            })
          );
        } catch (e) {
          setDirectoryItems([{ err: e.toString() }]);
        }
      } else {
        const drives = await formatDriveOutput();
        if (state.directoryTree[0]) {
          for (const item of drives) {
            if (item.isNetworkDrive) {
              dispatch({
                type: "addNetworkDrive",
                value: item.path,
              });
              setDirectoryItems(drives);
            }
          }
        }
      }
    }
    updatePage();
    // eslint-disable-next-line
  }, [state.currentDirectory]);

  return (
    <DirectoryContext.Provider
      value={{
        state,
        dispatch,
        directoryItems,
        setDirectoryItems,
        itemsSelected,
        setItemsSelected,
        settings,
        setSettings,
        lastSelected,
        setLastSelected,
        visibleItems,
        setRename,
        rename,
      }}
    >
      <Navbar />
      <DirectoryTree />
      <Page />
      <UIandUX visibleItems={visibleItems} setVisibleItems={setVisibleItems} />
    </DirectoryContext.Provider>
  );
}

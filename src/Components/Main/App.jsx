import React, { createContext, useEffect, useState } from "react";

import DirectoryState from "./DirectoryState";
import UIandUXState from "../UI and UX/UIandUXState";

import Page from "../DirectoryPage/Page";
import Navbar from "../Navbar/Navbar";
import DirectoryTree from "../DirectoryTree/DirectoryTree";
import FilesAndDirectories from "../DirectoryPage/FilesAndDirectories";

import formatMetadata from "../../Helpers/FS and OS/GetMetadata";
import formatDriveOutput from "../../Helpers/FS and OS/FormatDriveOutput";
import UIandUX from "../UI and UX/UIandUX";
import sortBy from "../../Helpers/SortBy";

export const DirectoryContext = createContext();

const fs = window.require("fs");
const { execSync } = window.require("child_process");
const getDimensions = window.require("get-media-dimensions");

export default function App() {
  const { state, dispatch } = DirectoryState();
  const { settings, setSettings } = UIandUXState();

  const [directoryItems, setDirectoryItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [lastSelected, setLastSelected] = useState();
  const [renameItem, setRenameItem] = useState();
  const [visibleItems, setVisibleItems] = useState([]);

  useEffect(() => {
    console.clear();
  }, []);

  useEffect(() => {
    async function updatePage() {
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
          setDirectoryItems(result);
          sortBy(setDirectoryItems, "Name");
        } catch (e) {
          setDirectoryItems([{ err: e.toString() }]);
        }
      } else {
        const drives = await formatDriveOutput();
        setDirectoryItems(drives);
        if (state.directoryTree[0]) {
          for (const item of drives) {
            if (item.isNetworkDrive) {
              dispatch({
                type: "addNetworkDrive",
                value: item.path,
              });
            }
          }
        }
      }
    }
    updatePage();
    // eslint-disable-next-line
  }, [state.currentDirectory]);

  const renderDirectoryItems = directoryItems.map((directoryItem) => {
    return (
      <FilesAndDirectories
        key={directoryItem.key || directoryItem.name}
        directoryItem={directoryItem}
        visibleItems={visibleItems}
        lastSelected={lastSelected}
        setLastSelected={setLastSelected}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
      />
    );
  });

  return (
    <DirectoryContext.Provider
      value={{
        state,
        dispatch,
        directoryItems,
        setDirectoryItems,
        settings,
        setSettings,
        renameItem,
        setRenameItem,
      }}
    >
      <Navbar selectedItems={selectedItems} />
      <DirectoryTree />
      <Page setVisibleItems={setVisibleItems}>{renderDirectoryItems}</Page>
      <UIandUX
        setLastSelected={setLastSelected}
        lastSelected={lastSelected}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
      />
      {/* <button
        style={{ position: "fixed" }}
        onClick={() => {
          localStorage.clear();
          window.location.reload(true);
        }}
      >
        Test Button
      </button> */}
    </DirectoryContext.Provider>
  );
}

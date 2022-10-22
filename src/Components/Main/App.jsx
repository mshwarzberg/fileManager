import React, { createContext, useEffect, useState } from "react";

import DirectoryState from "./State/DirectoryState";
import UIandUXState from "./State/UIandUXState";

import Page from "../DirectoryPage/Page";
import Navbar from "../Navbar/Navbar";
import DirectoryTree from "../DirectoryTree/DirectoryTree";
import FilesAndDirectories from "../DirectoryPage/FilesAndDirectories";

import formatMetadata from "../../Helpers/FS and OS/GetMetadata";
import formatDriveOutput from "../../Helpers/FS and OS/FormatDriveOutput";
import UIandUX from "./UIandUX";
import sortBy from "../../Helpers/SortBy";

export const GeneralContext = createContext();

const fs = window.require("fs");

export default function App() {
  const {
    state,
    state: { currentDirectory, drive },
    dispatch,
  } = DirectoryState();

  const { settings, setSettings } = UIandUXState();

  const [directoryItems, setDirectoryItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [lastSelected, setLastSelected] = useState();
  const [renameItem, setRenameItem] = useState();
  const [visibleItems, setVisibleItems] = useState([]);
  const [popup, setPopup] = useState({});
  const [clipboard, setClipboard] = useState({});

  useEffect(() => {
    console.clear();
  }, []);

  useEffect(() => {
    async function updatePage() {
      if (drive && currentDirectory) {
        document.title = currentDirectory;
        let result = [];
        try {
          if (currentDirectory === "Trash") {
            setDirectoryItems(JSON.parse(localStorage.getItem("trash")) || []);
            return;
          } else {
            result = fs
              .readdirSync(currentDirectory, {
                withFileTypes: true,
              })
              .map((file) => {
                return formatMetadata(file, currentDirectory, drive);
              })
              .filter((item) => {
                return item.name && item;
              });
          }
          setDirectoryItems(result);
          sortBy(setDirectoryItems, "Name");
        } catch (e) {
          setPopup({
            show: true,
            body: (
              <div id="body">
                <h1 id="description">{e.toString()}</h1>
              </div>
            ),
            ok: (
              <button
                onClick={() => {
                  setPopup({});
                }}
              >
                OK
              </button>
            ),
          });
          dispatch({
            type: "back",
            value: "error",
          });
        }
        setTimeout(() => {
          setSelectedItems([]);
        }, 100);
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
  }, [currentDirectory, drive]);

  useEffect(() => {
    if (!currentDirectory?.startsWith(drive) || !drive) {
      dispatch({
        type: "drive",
        value:
          currentDirectory === "Trash" ? drive : currentDirectory?.slice(0, 3),
      });
    }
  }, [currentDirectory]);

  useEffect(() => {
    document.body.className = settings.appTheme;
  }, [settings.appTheme]);

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
    <GeneralContext.Provider
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
      <Navbar setPopup={setPopup} />
      <DirectoryTree />
      <Page
        setVisibleItems={setVisibleItems}
        selectedItems={selectedItems}
        clipboard={clipboard}
      >
        {renderDirectoryItems}
      </Page>
      <UIandUX
        setLastSelected={setLastSelected}
        lastSelected={lastSelected}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        popup={popup}
        setPopup={setPopup}
        clipboard={clipboard}
        setClipboard={setClipboard}
      />

      {/* <button style={{ position: "fixed", zIndex: 10 }} onClick={() => {}}>
        Test Button
      </button> */}
    </GeneralContext.Provider>
  );
}

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

export default function App() {
  const {
    state,
    state: { currentDirectory, drive, networkDrives },
    dispatch,
  } = DirectoryState();
  const { settings, setSettings } = UIandUXState();

  const [directoryItems, setDirectoryItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [lastSelected, setLastSelected] = useState();
  const [renameItem, setRenameItem] = useState();
  const [visibleItems, setVisibleItems] = useState([]);
  const [popup, setPopup] = useState({});

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
                return formatMetadata(
                  file,
                  currentDirectory,
                  drive,
                  networkDrives.includes(drive)
                );
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
            body: <div id="body">{e.toString()}</div>,
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
      <Navbar selectedItems={selectedItems} setPopup={setPopup} />
      <DirectoryTree />
      <Page setVisibleItems={setVisibleItems} selectedItems={selectedItems}>
        {renderDirectoryItems}
      </Page>
      <UIandUX
        setLastSelected={setLastSelected}
        lastSelected={lastSelected}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        popup={popup}
        setPopup={setPopup}
      />
      <button
        style={{ position: "fixed" }}
        onClick={() => {
          // dispatch({
          //   type: "open",
          //   value: "null",
          // });
          // // setSettings((prevSettings) => {
          // // setPopup({
          // //   show: true,
          // //   body: (
          // //     <h1>{prevSettings.singleClickToOpen ? "double" : "single"}</h1>
          // //   ),
          // //   ok: <button id="ok">ok</button>,
          // //   cancel: <button id="cancel">cancel</button>,
          // // });
          // // return {
          // //   ...prevSettings,
          // //   singleClickToOpen: !prevSettings.singleClickToOpen,
          // // };
          // // });
        }}
      >
        Test Button
      </button>
    </DirectoryContext.Provider>
  );
}
